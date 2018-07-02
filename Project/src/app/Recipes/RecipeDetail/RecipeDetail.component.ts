import { Component, OnInit, Input } from '@angular/core';
import { Recipe } from '../Recipe.model';

@Component({
  selector: 'app-RecipeDetail',
  templateUrl: './RecipeDetail.component.html',
  styleUrls: ['./RecipeDetail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  @Input() recipe: Recipe;
  constructor() { }

  ngOnInit() {
  }

}
