/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2021 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

interface Props {
  className?: string;
}

export const GroupTitle: React.FC<Props> = function GroupTitle({ children, className }) {
  return (
    <h2 className={className}>
      {children}
    </h2>
  );
};
