/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2021 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import type { IGridOptions, ILayoutSizeProps } from './ILayoutContainerProps';

interface Props extends ILayoutSizeProps, IGridOptions {
  className?: string;
  form?: boolean;
}

export const Group: React.FC<Props> = function Group({ children, className }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
};
