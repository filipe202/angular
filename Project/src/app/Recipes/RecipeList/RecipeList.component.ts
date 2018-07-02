import { Component, OnInit } from '@angular/core';
import { Recipe } from '../Recipe.model';

@Component({
  selector: 'app-RecipeList',
  templateUrl: './RecipeList.component.html',
  styleUrls: ['./RecipeList.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [
    new Recipe(
      'Best Brownies',
      'Preteste.',
      'https://smokenfire.com/wp-content/uploads/2015/03/Recipe.png'
    ),
    new Recipe(
      'Best Brownies',
      'Preteste.',
      'https://smokenfire.com/wp-content/uploads/2015/03/Recipe.png'
    )
  ];

  constructor() {}

  ngOnInit() {}
}
