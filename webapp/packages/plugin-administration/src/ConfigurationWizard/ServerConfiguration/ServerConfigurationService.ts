/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2021 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { observable, makeObservable } from 'mobx';

import { AdministrationScreenService } from '@cloudbeaver/core-administration';
import { UsersResource } from '@cloudbeaver/core-authentication';
import { CONNECTION_NAVIGATOR_VIEW_SETTINGS } from '@cloudbeaver/core-connections';
import { injectable } from '@cloudbeaver/core-di';
import { NotificationService } from '@cloudbeaver/core-events';
import { IExecutor, Executor } from '@cloudbeaver/core-executor';
import { ServerConfigResource } from '@cloudbeaver/core-root';
import { GraphQLService, ServerConfig } from '@cloudbeaver/core-sdk';

import type { IServerConfigurationPageState } from './IServerConfigurationPageState';

export interface IValidationStatusContext {
  getState: () => boolean;
  invalidate: () => void;
}

@injectable()
export class ServerConfigurationService {
  state: IServerConfigurationPageState;
  loading: boolean;
  readonly validationTask: IExecutor<boolean>;

  constructor(
    private readonly administrationScreenService: AdministrationScreenService,
    private readonly serverConfigResource: ServerConfigResource,
    private readonly graphQLService: GraphQLService,
    private readonly notificationService: NotificationService,
    private readonly usersResource: UsersResource
  ) {
    makeObservable(this, {
      state: observable,
      loading: observable,
    });

    this.loading = true;
    this.state = this.getConfig();
    this.validationTask = new Executor();
  }

  async loadConfig(): Promise<void> {
    this.loading = true;
    try {
      const config = await this.serverConfigResource.load();

      this.state = this.administrationScreenService
        .getItemState(
          'server-configuration',
          () => this.getConfig(config),
          !config?.configurationMode
        );
    } catch (exception) {
      this.notificationService.logException(exception, 'Can\'t load server configuration');
    } finally {
      this.loading = false;
    }
  }

  isDone(): boolean {
    return this.isFormFilled();
  }

  validationStatusContext = (): IValidationStatusContext => {
    let state = this.isFormFilled();

    const invalidate = () => {
      state = false;
    };
    const getState = () => state;

    return {
      getState,
      invalidate,
    };
  };

  async save(): Promise<void> {
    if (!this.state) {
      throw new Error('No state available');
    }

    if (!(await this.validate())) {
      return;
    }

    try {
      await this.graphQLService.sdk.setDefaultNavigatorSettings({ settings: this.state.navigatorConfig });
      await this.graphQLService.sdk.configureServer({
        configuration: {
          ...this.state.serverConfig,
          sessionExpireTime: (this.state.serverConfig.sessionExpireTime ?? 30) * 1000 * 60,
        },
      });
      await this.serverConfigResource.update();
      this.usersResource.refreshAllLazy();
    } catch (exception) {
      this.notificationService.logException(exception, 'Can\'t save server configuration');

      throw exception;
    }
  }

  async handleConfigurationFinish(): Promise<void> {
    await this.save();
  }

  async validate(): Promise<boolean> {
    const context = await this.validationTask.execute(true);
    const state = await context.getContext(this.validationStatusContext);

    return state.getState();
  }

  private isFormFilled() {
    if (!this.state?.serverConfig.serverName) {
      return false;
    }
    if ((this.state.serverConfig.sessionExpireTime ?? 0) < 1) {
      return false;
    }
    if (this.administrationScreenService.isConfigurationMode) {
      if (!this.state.serverConfig.adminName
        || this.state.serverConfig.adminName.length < 6
        || !this.state.serverConfig.adminPassword
      ) {
        return false;
      }
    }
    return true;
  }

  private getConfig(config?: ServerConfig | null): IServerConfigurationPageState {
    if (!config || config?.configurationMode) {
      return {
        serverConfig: {
          serverName: 'CloudBeaver',
          adminName: 'cbadmin',
          adminPassword: '',
          anonymousAccessEnabled: true,
          authenticationEnabled: true,
          adminCredentialsSaveEnabled: true,
          publicCredentialsSaveEnabled: true,
          customConnectionsEnabled: true,
          sessionExpireTime: 30,
        },
        navigatorConfig: { ...CONNECTION_NAVIGATOR_VIEW_SETTINGS.advanced },
      };
    }

    return {
      serverConfig: {
        serverName: config.name,
        anonymousAccessEnabled: config.anonymousAccessEnabled,
        authenticationEnabled: config.authenticationEnabled,
        adminCredentialsSaveEnabled: config.adminCredentialsSaveEnabled,
        publicCredentialsSaveEnabled: config.publicCredentialsSaveEnabled,
        customConnectionsEnabled: config.supportsCustomConnections,
        sessionExpireTime: (config.sessionExpireTime ?? 1800000) / 1000 / 60,
      },
      navigatorConfig: { ...config.defaultNavigatorSettings },
    };
  }
}
