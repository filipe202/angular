import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './Header/Header.component';
import { RecipesComponent } from './Recipes/Recipes.component';
import { RecipeDetailComponent } from './Recipes/RecipeDetail/RecipeDetail.component';
import { RecipeListComponent } from './Recipes/RecipeList/RecipeList.component';
import { RecipeItemComponent } from './Recipes/RecipeList/RecipeItem/RecipeItem.component';

import { ShoppingListComponent } from './ShoppingList/ShoppingList.component';
import { ShoppingListEditComponent } from './ShoppingList/ShoppingListEdit/ShoppingListEdit.component';

@NgModule({
   declarations: [
      AppComponent,
      HeaderComponent,
      RecipeDetailComponent,
      RecipeItemComponent,
      RecipeListComponent,
      ShoppingListComponent,
      ShoppingListEditComponent,
      RecipesComponent
   ],
   imports: [
      BrowserModule
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
