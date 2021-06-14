import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { DocsComponent } from './pages/docs/docs.component';
import { SupportComponent } from './pages/support/support.component';
import { Link1Component } from './pages/link1/link1.component';
import { LandAreasComponent } from "./pages/land-areas/land-areas.component";

const routes: Routes = [
	{
		path: '',
		loadChildren: () => import('./starter-home/starter-home.module').then(m => m.StarterHomeModule)
	},
	{
		path: 'catalog',
		component: CatalogComponent
	},
	{
		path: 'docs',
		component: DocsComponent
	},
	{
		path: 'support',
		component: SupportComponent
	},
	{
		path: 'link1',
		component: Link1Component
	},
	{
		path: 'land-areas',
		component: LandAreasComponent
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
	exports: [RouterModule]
})
export class AppRoutingModule { }
