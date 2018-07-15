import { Component, OnInit } from '@angular/core';
import { Recipe } from '../Recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-RecipeList',
  templateUrl: './RecipeList.component.html',
  styleUrls: ['./RecipeList.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[];


  constructor(private recipeService: RecipeService, private route:  ActivatedRoute, private router:  Router) {}

  ngOnInit() {
    this.recipeService.recipesChanged.subscribe((recipes:  Recipe[])  =>  {
      this.recipes = recipes;

    });
    this.recipes = this.recipeService.getRecipes();

  }
  onNewRecipe()  {
    this.router.navigate(['new'], {relativeTo:  this.route});
  }
}
