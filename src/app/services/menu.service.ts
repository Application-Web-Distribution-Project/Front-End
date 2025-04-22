import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Menu } from '../models/menu.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private baseUrl = '/menus';

  constructor(private http: HttpClient) {}

  // GET all menus
  getMenus(): Observable<Menu[]> {
    return this.http.get<Menu[]>(`${this.baseUrl}/all`);
  }

  // POST: Add new menu
  addMenu(menu: Partial<Menu>): Observable<Menu> {
    return this.http.post<Menu>(`${this.baseUrl}/add`, menu);
  }

  // PUT: Update existing menu by ID
  updateMenu(id: number, menu: Menu): Observable<Menu> {
    return this.http.put<Menu>(`${this.baseUrl}/modify/${id}`, menu);
  }

  // DELETE: Delete menu by ID
  deleteMenu(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`).pipe(
      catchError((error) => {
        // Check if this is an optimistic locking exception
        if (
          error.status === 409 ||
          (error.error &&
            error.error.includes('ObjectOptimisticLockingFailureException'))
        ) {
          return throwError(() => new Error('CONCURRENT_MODIFICATION'));
        }
        return throwError(() => error);
      })
    );
  }

  // NEW API METHODS

  // Get similar recipes by dish name
  getSimilarRecipes(dishName: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/recipes/similar/${encodeURIComponent(dishName)}`
    );
  }

  // Get nutrition information by recipe ID
  getNutritionInfo(recipeId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/recipes/nutrition/${recipeId}`);
  }

  // Get weather-based food recommendations
  getWeatherRecommendations(city: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/weather?city=${encodeURIComponent(city)}`
    );
  }
}
