/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2021 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { observer } from 'mobx-react-lite';

import { useNode } from '../../shared/NodesManager/useNode';
import { NavigationNode } from './NavigationNode';

interface NavigationTreeNodeProps {
  nodeId: string;
}

export const NavigationNodeElement = observer(function NavigationNodeElement({
  nodeId,
}: NavigationTreeNodeProps) {
  const { node } = useNode(nodeId);

  if (!node) {
    return null;
  }

  return <NavigationNode node={node} component={NavigationNodeElement} />;
});
