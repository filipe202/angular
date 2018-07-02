import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Recipe } from '../Recipe.model';

@Component({
  selector: 'app-RecipeList',
  templateUrl: './RecipeList.component.html',
  styleUrls: ['./RecipeList.component.css']
})
export class RecipeListComponent implements OnInit {
  @Output() selectRecipe = new EventEmitter<Recipe>();

  recipes: Recipe[] = [
    new Recipe(
      'Best Brownies1',
      'Preteste.1',
      'https://smokenfire.com/wp-content/uploads/2015/03/Recipe.png'
    ),
    new Recipe(
      'Best Brownies2',
      'Preteste.2',
      'https://smokenfire.com/wp-content/uploads/2015/03/Recipe.png'
    )
  ];

  constructor() {}

  ngOnInit() {}

  onSelectRecipe(recipe: Recipe)  {
    this.selectRecipe.emit(recipe);

  }
}
