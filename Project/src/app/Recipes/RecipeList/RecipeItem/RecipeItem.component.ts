import { Component, Input} from '@angular/core';
import {Recipe} from '../../Recipe.model';
import { RecipeService } from '../../recipe.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-RecipeItem',
  templateUrl: './RecipeItem.component.html',
  styleUrls: ['./RecipeItem.component.css']
})
export class RecipeItemComponent  {
  // tslint:disable-next-line:no-input-rename
  @Input('recipe') r: Recipe;
  @Input() index: number;

}
