import { Component, OnInit } from '@angular/core';
import { Recipe } from '../Recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-RecipeDetail',
  templateUrl: './RecipeDetail.component.html',
  styleUrls: ['./RecipeDetail.component.css']
})
export class RecipeDetailComponent implements OnInit {
   recipe: Recipe;
   recipeIndex:  number;
  constructor(private recipeService:  RecipeService, private route:  ActivatedRoute, private router:  Router) { }

  ngOnInit() {
    this.route.params.subscribe((params:  Params)  =>  {
      this.recipeIndex = +params['id'];
      this.recipe = this.recipeService.getRecipe(this.recipeIndex);
    }
  );

  }

  sendIngredientsToShoppingList()  {
      this.recipeService.sendIngredientsToShoppingList(this.recipe.ingredients);
  }
  onEditRecipe()  {
    this.router.navigate(['edit'], {relativeTo:  this.route});

  }
  onDeleteRecipe()  {
    this.recipeService.deleteRecipe(this.recipeIndex);
    this.router.navigate(['../'], { relativeTo: this.route });

  }
}
