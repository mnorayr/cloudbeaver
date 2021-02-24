/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2021 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { css } from 'reshadow';

export const baseFormControlStylesNew = css`
  field {
    box-sizing: border-box;
    padding: 12px;
    min-height: 54px;
    max-width: 100%;
    &[|small] {
      max-width: 240px;
    }
    &[|medium] {
      max-width: 440px;
    }
    &[|large] {
      max-width: 640px;
    }
    &[|full] {
      grid-column: 1/-1;
    }
  }

  field-label {
    composes: theme-typography--body1 from global;
    box-sizing: border-box;
    line-height: 16px;
    font-weight: 500;
  }

  field-description {
    composes: theme-typography--caption from global;
    padding-top: 8px;
  }
`;