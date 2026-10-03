import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Loading } from '../../shared/loading/loading';

@Component({
  imports: [RouterOutlet, Loading],
  selector: 'app-loading-layout',
  styleUrl: './loading-layout.scss',
  templateUrl: './loading-layout.html',
})
export class LoadingLayout {}
