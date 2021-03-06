/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2021 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { AnnotationsMap, observable } from 'mobx';
import { useState } from 'react';

export function useObjectRef<T>(init: T, update?: Partial<T>, observed?: boolean | AnnotationsMap<T, never>): T {
  const [ref] = useState(() => {
    if (observed) {
      return observable.object(init, typeof observed === 'object' ? observed : undefined, { deep: false });
    }
    return init;
  });

  if (update) {
    Object.assign(ref, update);
  } else {
    Object.assign(ref, init);
  }

  return ref;
}
