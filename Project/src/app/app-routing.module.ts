import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RecipesComponent } from './Recipes/Recipes.component';
import { RecipeDetailComponent } from './Recipes/RecipeDetail/RecipeDetail.component';
import { ShoppingListComponent } from './ShoppingList/ShoppingList.component';
import { NoRecipeComponent } from './Recipes/RecipeList/no-recipe/no-recipe.component';
import { RecipeEditComponent } from './Recipes/RecipeEdit/RecipeEdit.component';


const appRoutes: Routes =  [
  {
    path:  'recipes',
    component:  RecipesComponent,
    children:  [
      {
        path:  'new',
        component:  RecipeEditComponent
      },
      {
        path:  ':id',
        component:  RecipeDetailComponent
      },
      {
        path:  ':id/edit',
        component:  RecipeEditComponent
      },
      {
        path:  '',
        component:  NoRecipeComponent
      }
    ]
  },
  {
    path:  '',
    redirectTo:  'recipes',
    pathMatch:  'full'
  },
  {
    path:  'shoppingList',
    component:  ShoppingListComponent
  }
];

@NgModule({
  imports:  [
    RouterModule.forRoot(appRoutes)
  ],
  exports:  [RouterModule]
})
export class AppRoutingModule  {

}
