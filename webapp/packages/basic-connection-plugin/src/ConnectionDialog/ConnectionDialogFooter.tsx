/*
 * cloudbeaver - Cloud Database Manager
 * Copyright (C) 2020 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { observer } from 'mobx-react';
import styled, { css } from 'reshadow';

import { Button } from '@dbeaver/core/blocks';
import { useTranslate } from '@dbeaver/core/localization';

const styles = css`
controls {
  display: flex;
  flex: 1;
  height: 100%;
  align-items: center;
  margin: auto;
}

fill {
  flex: 1;
}

Button:not(:first-child) {
  margin-left: 24px;
}
`;

type ConnectionDialogFooterProps = {
  isConnecting: boolean;
  onConnect(): void;
  onBack(): void;
}

export const ConnectionDialogFooter = observer(
  function ConnectionDialogFooter({
    isConnecting,
    onConnect,
    onBack,
  }: ConnectionDialogFooterProps) {
    const translate = useTranslate();
    return styled(styles)(
      <controls as="div">
        <Button
          type="button"
          mod={['outlined']}
          onClick={onBack}
          disabled={isConnecting}
        >
          {translate('ui_stepper_back')}
        </Button>
        <fill as="div"/>
        <Button
          type="button"
          mod={['unelevated']}
          onClick={onConnect}
          disabled={isConnecting}
        >
          {isConnecting
            ? translate('basicConnection_connectionDialog_connecting')
            : translate('basicConnection_connectionDialog_connect')}
        </Button>
      </controls>
    );
  }
);
