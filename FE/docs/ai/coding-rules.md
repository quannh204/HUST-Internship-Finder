# Coding Rules — doc-ai-web

## TypeScript

### DO
- Dùng `interface` cho props, API types, Redux state
- Đặt `React.FC<Props>` cho component type
- Dùng `PayloadAction<T>` trong slice reducers
- Dùng `Observable<T>` làm return type của service methods
- Đặt type riêng ở `src/types/` hoặc `types/` trong feature folder

### DON'T
- Không dùng `any` tường minh — ít nhất dùng `unknown` nếu cần
- Không dùng `as any` để bypass lỗi — hãy fix type thực sự
- Không export interface không dùng

```typescript
// ✅ Đúng
interface ProjectFormValues {
  name: string;
  code: string;
  startDate: string;
}
const ProjectForm: React.FC<{ project: ProjectResponse }> = ({ project }) => { ... };

// ❌ Sai
const ProjectForm = (props: any) => { ... };
```

---

## Import Order

Thứ tự chuẩn (không có Prettier enforce, nhưng convention nhất quán):

```typescript
// 1. React / React ecosystem
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Third-party
import { Form, message, Table } from 'antd';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

// 3. Internal — @/ alias (stores, services)
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { projectActions } from '@/store/project';
import projectService from '@/Services/ProjectService';

// 4. Internal — components, design-system
import { Button, CommonTable, Input } from '@/design-system';
import { CLoading } from '@/components/common/CLoading';

// 5. Types
import type { ProjectResponse } from '@/Services/types';

// 6. Styles
import styles from './ProjectsList.module.less';
```

- **LUÔN** dùng `@/` alias, không dùng relative `../../`
- Exception: import trong cùng feature folder (ví dụ `./utils`, `./hooks/useX`)

---

## Component Structure

```typescript
// Template chuẩn cho page/feature component
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { featureActions } from '@/store/feature';

interface FeaturePageProps {
  // props nếu có
}

const FeaturePage: React.FC<FeaturePageProps> = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  // 1. Selectors (đọc state)
  const data = useAppSelector(state => state.feature.data);
  const loading = useAppSelector(state => state.loading.featureLoad);

  // 2. Local state
  const [isOpen, setIsOpen] = useState(false);

  // 3. Effects
  useEffect(() => {
    dispatch(featureActions.getDataRequest({}));
  }, [dispatch]);

  // 4. Handlers
  const handleSubmit = () => {
    dispatch(featureActions.createRequest({ ... }));
  };

  // 5. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

export default FeaturePage;
```

---

## Redux Pattern

### Slice
```typescript
// src/store/<feature>/<feature>Slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FeatureState {
  items: FeatureItem[];
  selectedItem: FeatureItem | null;
}

const initialState: FeatureState = {
  items: [],
  selectedItem: null,
};

const featureSlice = createSlice({
  name: 'feature',
  initialState,
  reducers: {
    // _Request actions: empty body (handled by epic)
    getItemsRequest: (state, action: PayloadAction<any>) => {},
    // _Response/set actions: update state
    setItems: (state, action: PayloadAction<FeatureItem[]>) => {
      state.items = action.payload;
    },
    setSelectedItem: (state, action: PayloadAction<FeatureItem | null>) => {
      state.selectedItem = action.payload;
    },
  },
});

export const featureActions = featureSlice.actions;
export const featureReducer = featureSlice.reducer;
```

### Epic
```typescript
// src/store/<feature>/<feature>Epics.ts
import { ofType } from 'redux-observable';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { featureActions } from './<feature>Slice';
import featureService from '@/Services/FeatureService';

const getItemsEpic: Epic = (action$) =>
  action$.pipe(
    ofType(featureActions.getItemsRequest.type),
    switchMap(({ payload }) =>
      featureService.Get.getItems(payload).pipe(
        map((response) => featureActions.setItems(response)),
        catchError((err) => of(/* error action */))
      )
    )
  );

export const featureEpics = [getItemsEpic];
```

### Selector
```typescript
// src/store/<feature>/<feature>Selector.ts
import { RootState } from '@/store/types';

export const selectFeatureItems = (state: RootState) => state.feature.items;
export const selectSelectedItem = (state: RootState) => state.feature.selectedItem;
```

### Đăng ký vào root
```typescript
// src/store/reducers.ts — thêm reducer
feature: featureReducer,

// src/store/epics.ts — thêm epics
...featureEpics,
```

---

## Service (HTTP)

```typescript
// src/Services/FeatureService.ts
import { Observable } from 'rxjs';
import { HttpClient } from './HttpClient';
import { ApiReduxHelpers, APIHosts } from './reduxHelpers';

class FeatureController extends ApiReduxHelpers {
  ApiHost = APIHosts.SomeHost;

  public Get = {
    getItems: (params?: Record<string, any>): Observable<FeatureItem[]> =>
      HttpClient.get(`${this.ApiHost}/api/Feature`, { params }),

    getItemById: (id: string): Observable<FeatureItem> =>
      HttpClient.get(`${this.ApiHost}/api/Feature/${id}`),
  };

  public Post = {
    createItem: (data: CreateItemData): Observable<FeatureItem> =>
      HttpClient.post(`${this.ApiHost}/api/Feature`, data),
  };

  public Put = {
    updateItem: (id: string, data: Partial<CreateItemData>): Observable<FeatureItem> =>
      HttpClient.put(`${this.ApiHost}/api/Feature/${id}`, data),
  };

  public Delete = {
    deleteItem: (id: string): Observable<void> =>
      HttpClient.delete(`${this.ApiHost}/api/Feature/${id}`),
  };
}

const featureService = new FeatureController();
export default featureService;
```

**Chuyển Observable → Promise khi cần trong async handler:**
```typescript
import { lastValueFrom } from 'rxjs';
const result = await lastValueFrom(featureService.Get.getItems());
```

---

## Forms (Ant Design)

```typescript
const [form] = Form.useForm<FormValues>();

// Set giá trị
form.setFieldsValue({ name: item.name, code: item.code });

// Validate và lấy giá trị
const handleSubmit = async () => {
  try {
    const values = await form.validateFields();
    dispatch(featureActions.createRequest(values));
  } catch {
    // Ant Design tự hiển thị validation errors
  }
};

// Form JSX
<Form form={form} layout="vertical" onFinish={handleSubmit}>
  <Form.Item
    label={t('feature.field.name')}
    name="name"
    rules={[
      { required: true, message: t('validation.required') },
      { min: 3, message: t('validation.minLength', { min: 3 }) },
    ]}
  >
    <Input />
  </Form.Item>
  <Button variant="primary" htmlType="submit">
    {t('common.action.save')}
  </Button>
</Form>
```

---

## i18n

```typescript
// Trong component
const { t } = useTranslation(); // default namespace = 'translation'
const { t: tConfig } = useTranslation('configuration'); // namespace khác

// Sử dụng
t('page.featureName.title')
t('message.createSuccess', { entity: t('common.entity.feature') })
t('common.action.create')

// Thêm key mới — PHẢI thêm vào cả 2 file:
// src/translations/resources/en/translation.json
// src/translations/resources/vi/translation.json
```

**Cấu trúc key:**
```
page.<pageName>.<element>     — text riêng cho page
common.action.<verb>          — nút/action chung (create, update, delete, cancel)
common.entity.<noun>          — tên entity (project, file, folder)
message.<event>               — thông báo (createSuccess, updateSuccess)
validation.<rule>             — lỗi validation
httpError.<statusCode>        — lỗi HTTP
```

---

## Naming Conventions

| Loại | Convention | Ví dụ |
|------|-----------|-------|
| Component file | PascalCase.tsx | `ProjectsList.tsx` |
| Hook file | useCamelCase.ts | `useHierarchyData.ts` |
| Service file | PascalCaseService.ts | `ProjectService.ts` |
| Slice file | camelCaseSlice.ts | `projectSlice.ts` |
| Epic file | camelCaseEpics.ts | `projectEpics.ts` |
| Selector file | camelCaseSelector.ts | `projectSelector.ts` |
| Style file | ComponentName.module.less | `ProjectsList.module.less` |
| Type/Interface | PascalCase | `ProjectResponse`, `UserProfile` |
| Constant | UPPER_SNAKE_CASE | `PROFILE_KEY`, `DEFAULT_PAGE_SIZE` |
| Variable/Function | camelCase | `handleLogin`, `isLoading` |
| Redux slice name | lowercase | `'project'`, `'file'` |
| Directory (feature) | PascalCase | `ProjectsList/`, `LoginPage/` |
| Directory (utility) | lowercase | `hooks/`, `utils/`, `store/` |

---

## Barrel Exports

Mỗi thư mục nên có `index.ts`:

```typescript
// src/design-system/components/Button/index.ts
export { Button } from './Button';
export type { ButtonProps, ButtonVariant } from './Button';

// src/design-system/index.ts
export { Button } from './components/Button';
export { CommonTable } from './components/CommonTable';
export { Input } from './components/Input';
```

Import sử dụng:
```typescript
import { Button, CommonTable } from '@/design-system'; // ✅
import { Button } from '@/design-system/components/Button/Button'; // ❌ quá dài
```
