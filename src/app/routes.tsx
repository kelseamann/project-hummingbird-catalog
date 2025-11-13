import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Catalog } from '@app/Catalog/Catalog';
import { DetailPage } from '@app/DetailPage/DetailPage';

export interface IAppRoute {
  label?: string;
  element: React.ReactElement;
  exact?: boolean;
  path: string;
  title: string;
  routes?: undefined;
}

export interface IAppRouteGroup {
  label: string;
  routes: IAppRoute[];
}

export type AppRouteConfig = IAppRoute | IAppRouteGroup;

const routes: AppRouteConfig[] = [
  {
    element: <Catalog />,
    exact: true,
    label: 'Catalog',
    path: '/',
    title: 'Project Hummingbird Catalog',
  },
  {
    element: <DetailPage />,
    exact: true,
    path: '/detail/:name',
    title: 'Project Hummingbird Catalog - Detail',
  },
];

const flattenedRoutes: IAppRoute[] = routes.reduce(
  (flattened, route) => [...flattened, ...(route.routes ? route.routes : [route])],
  [] as IAppRoute[],
);

const AppRoutes = (): React.ReactElement => (
  <Routes>
    {flattenedRoutes.map(({ path, element }, idx) => (
      <Route path={path} element={element} key={idx} />
    ))}
  </Routes>
);

export { AppRoutes, routes };

