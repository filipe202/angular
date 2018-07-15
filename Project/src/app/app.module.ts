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
import { DropdownDirective } from './shared/dropdown.directive';
import { ShoppingListService } from './ShoppingList/shoppingList.service';
import { AppRoutingModule } from './app-routing.module';
import { NoRecipeComponent } from './Recipes/RecipeList/no-recipe/no-recipe.component';
import { RecipeEditComponent } from './Recipes/RecipeEdit/RecipeEdit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecipeService } from './Recipes/recipe.service';

@NgModule({
   declarations: [
      AppComponent,
      HeaderComponent,
      RecipeDetailComponent,
      RecipeItemComponent,
      RecipeListComponent,
      ShoppingListComponent,
      ShoppingListEditComponent,
      RecipesComponent,
      DropdownDirective,
      NoRecipeComponent,
      RecipeEditComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      FormsModule,
      ReactiveFormsModule
    ],
   providers: [ShoppingListService, RecipeService],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
