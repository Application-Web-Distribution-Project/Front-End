import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  ElementRef,
} from '@angular/core';
import { MenuService } from '../../../../services/menu.service';
import { Menu } from '../../../../models/menu.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode'; // Correctly import jwtDecode

// jQuery declaration for TypeScript
declare var $: any;

@Component({
  selector: 'app-menulist',
  templateUrl: './menulist.component.html',
  styleUrls: ['./menulist.component.css'],
})
export class MenuListComponent implements OnInit {
  menus: Menu[] = [];
  modalContent: any;
  quantity: number = 1;
  newMenu: Menu = this.initializeNewMenu();
  editMenu: Menu = this.initializeNewMenu();

  // Image mapping for menus (since Menu interface doesn't have img property)
  menuImages: { [key: number]: string } = {};
  defaultImage: string = 'assets/img/default-food.jpg';

  // Footer style
  classname = 'ct-footer footer-dark';
  ftlogo = 'assets/img/logo-light.png';
  closeResult: string;

  // New properties for API features
  cityName: string = '';
  weatherResults: string = '';
  weatherLoading: boolean = false;

  dishName: string = '';
  similarRecipes: any = null;
  similarLoading: boolean = false;

  recipeId: number | null = null;
  selectedMenuId: number | null = null;
  nutritionInfo: any = null;
  nutritionLoading: boolean = false;
  @ViewChild('nutritionModal') nutritionModal: TemplateRef<any>;

  userRole: string = ''; // Store the user's role

  constructor(
    private menuService: MenuService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMenus();
    this.decodeUserRole();
  }

  // Decode the JWT token to get the user's role
  decodeUserRole(): void {
    const token = localStorage.getItem('JWT_TOKEN');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token); // Use jwtDecode as a named import
        this.userRole = decodedToken.role || '';
      } catch (error) {
        console.error('Error decoding JWT token:', error);
      }
    }
  }

  // Restrict actions based on role
  canEdit(): boolean {
    return this.userRole === 'ADMIN';
  }

  canAdd(): boolean {
    return this.userRole === 'ADMIN';
  }

  canDelete(): boolean {
    return this.userRole === 'ADMIN';
  }

  canViewPayment(): boolean {
    return this.userRole === 'USER' || this.userRole === 'ADMIN';
  }

  orderAllMenu() {
    const totalSum = this.menus.reduce((sum, menu) => sum + menu.price, 0);
    const invoiceData = {
      items: this.menus,
      total: totalSum,
    };
    localStorage.setItem('invoiceData', JSON.stringify(invoiceData));
    this.router.navigate(['/invoice']);
  }

  // Load menus from service
  loadMenus(): void {
    this.menuService.getMenus().subscribe({
      next: (data) => {
        this.menus = data;
        // Initialize with default images for any new menus
        this.menus.forEach((menu) => {
          if (!this.menuImages[menu.id]) {
            this.menuImages[menu.id] = this.defaultImage;
          }
        });
      },
      error: (err) => {
        console.error('Error loading menus:', err);
        alert('Error loading menu items. Please try again later.');
      },
    });
  }

  // Get image for a menu
  getMenuImage(menuId: number): string {
    return this.menuImages[menuId] || this.defaultImage;
  }

  // Modal functions
  open(content: any, item: any): void {
    this.modalContent = {
      ...item,
      img: this.getMenuImage(item.id),
    };
    this.quantity = 1; // Reset quantity
    this.modalService.open(content, {
      centered: true,
      size: 'lg',
      windowClass: 'customizeModal',
    });
  }

  openAddMenuModal(content: any): void {
    this.newMenu = this.initializeNewMenu();
    this.modalService.open(content, { centered: true });
  }

  openEditMenuModal(menu: Menu, content: any): void {
    // Clone the menu to avoid direct reference
    this.editMenu = { ...menu };
    this.modalService.open(content, { centered: true });
  }

  // CRUD Operations
  addMenu(): void {
    // Create a copy without the id property
    const { id, ...menuWithoutId } = this.newMenu;

    // Send the menu without ID to the backend
    this.menuService.addMenu(menuWithoutId as Menu).subscribe({
      next: (addedMenu) => {
        this.menus.push(addedMenu);
        this.menuImages[addedMenu.id] = this.defaultImage;
        this.newMenu = this.initializeNewMenu();
        this.modalService.dismissAll();
      },
      error: (err) => {
        console.error('Error adding menu:', err);
        alert('Failed to add menu item. Please try again.');
      },
    });
  }

  updateMenu(): void {
    this.menuService.updateMenu(this.editMenu.id, this.editMenu).subscribe({
      next: (updatedMenu) => {
        const index = this.menus.findIndex((m) => m.id === updatedMenu.id);
        if (index !== -1) {
          this.menus[index] = updatedMenu;
        }
        this.modalService.dismissAll();
      },
      error: (err) => {
        console.error('Error updating menu:', err);
        alert('Failed to update menu item. Please try again.');
      },
    });
  }

  confirmDelete(id: number): void {
    if (confirm('Are you sure you want to delete this menu item?')) {
      this.deleteMenu(id);
    }
  }

  deleteMenu(id: number): void {
    this.menuService.deleteMenu(id).subscribe({
      next: () => {
        // Remove the deleted menu from the local array
        this.menus = this.menus.filter((menu) => menu.id !== id);

        // Clean up the image reference if you have one
        delete this.menuImages[id];
      },
      error: (err) => {
        if (err.message === 'CONCURRENT_MODIFICATION') {
          // Handle concurrent modification specifically
          alert(
            'This menu was recently modified or deleted by another user. Refreshing data...'
          );

          // Call your existing loadMenus method to refresh the data
          this.loadMenus();
        } else {
          console.error('Error deleting menu:', err);
        }
      },
    });
  }

  // Helper functions
  initializeNewMenu(): Menu {
    return {
      id: 0,
      name: '',
      description: '',
      price: 0,
    };
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  calculateTotal(): number {
    return this.modalContent ? this.modalContent.price * this.quantity : 0;
  }

  // Switch to a specific tab using jQuery for Bootstrap 4
  switchToTab(tabId: string): void {
    // Wait for a tick to ensure DOM is ready
    setTimeout(() => {
      $(`#${tabId}-tab`).tab('show');
    }, 0);
  }

  // Weather-based food recommendations
  getWeatherRecommendations(): void {
    if (!this.cityName) {
      alert('Please enter a city name');
      return;
    }

    this.weatherLoading = true;
    this.weatherResults = '';

    this.menuService.getWeatherRecommendations(this.cityName).subscribe({
      next: (data) => {
        // Format the data for display
        if (data && data.results) {
          // Create HTML content from the results
          let formattedResults = '<div class="weather-recommendations">';
          formattedResults +=
            '<h5>Recommended dishes based on your local weather:</h5>';
          formattedResults += '<div class="row">';

          data.results.forEach((recipe: any) => {
            formattedResults += `
              <div class="col-md-4 mb-3">
                <div class="card h-100">
                  <img src="${recipe.image}" class="card-img-top" alt="${recipe.title}">
                  <div class="card-body">
                    <h6 class="card-title">${recipe.title}</h6>
                    <button class="btn btn-sm btn-outline-primary mt-2" 
                      onclick="
                        document.getElementById('recipeId').value=${recipe.id};
                        document.getElementById('nutrition-tab').click();
                        setTimeout(() => {
                          document.getElementById('nutrition-button').click();
                        }, 100);
                      ">
                      View Nutrition
                    </button>
                  </div>
                </div>
              </div>
            `;
          });

          formattedResults += '</div></div>';
          this.weatherResults = formattedResults;
        } else {
          this.weatherResults =
            '<p>No recommendations found for this location.</p>';
        }
        this.weatherLoading = false;
      },
      error: (err) => {
        console.error('Error fetching weather recommendations:', err);
        this.weatherLoading = false;
        alert('Failed to get weather recommendations. Please try again.');
      },
    });
  }

  // Process nutrition request
  processNutritionRequest(): void {
    const recipeIdInput = document.getElementById(
      'recipeId'
    ) as HTMLInputElement;
    if (recipeIdInput && recipeIdInput.value) {
      const id = parseInt(recipeIdInput.value, 10);
      if (!isNaN(id)) {
        // Switch to nutrition tab
        this.switchToTab('nutrition');

        // Set the recipe ID in the input field
        this.recipeId = id;

        // Get nutrition info
        setTimeout(() => {
          this.getNutrition(id);
        }, 100);
      }
    }
  }

  // Similar recipes search
  findSimilarRecipes(defaultName?: string): void {
    console.log(
      'findSimilarRecipes called with:',
      defaultName || this.dishName
    );
    const searchName = defaultName || this.dishName;

    if (!searchName) {
      alert('Please enter a dish name');
      return;
    }

    // If called from menu item button, update the search field
    if (defaultName) {
      this.dishName = defaultName;
    }

    this.similarLoading = true;
    this.similarRecipes = null;

    // Programmatically switch to similar tab
    this.switchToTab('similar');

    this.menuService.getSimilarRecipes(searchName).subscribe({
      next: (data) => {
        console.log('Received similar recipes data:', data);
        this.similarRecipes = data;
        this.similarLoading = false;
      },
      error: (err) => {
        console.error('Error finding similar recipes:', err);
        this.similarLoading = false;
        alert('Failed to find similar recipes. Please try again.');
      },
    });
  }

  // Nutrition information retrieval
  getNutrition(id: number): void {
    console.log('getNutrition called with ID:', id);
    if (!id) {
      alert('Please enter a valid recipe ID');
      return;
    }

    this.nutritionLoading = true;
    this.nutritionInfo = null;

    // Programmatically switch to nutrition tab
    this.switchToTab('nutrition');

    this.menuService.getNutritionInfo(id).subscribe({
      next: (data) => {
        console.log('Received nutrition data:', data);
        this.nutritionInfo = data;
        this.nutritionLoading = false;

        // Select the menu item in the dropdown
        this.selectedMenuId = id;
      },
      error: (err) => {
        console.error('Error fetching nutrition info:', err);
        this.nutritionLoading = false;
        alert('Failed to get nutrition information. Please try again.');
      },
    });
  }

  // Helper method to get nutrient value by name for display
  getNutrientValue(name: string): string {
    if (!this.nutritionInfo || !this.nutritionInfo.nutrients) {
      return 'N/A';
    }

    const nutrient = this.nutritionInfo.nutrients.find(
      (n: any) => n.name === name
    );
    if (nutrient) {
      return `${nutrient.amount} ${nutrient.unit}`;
    }
    return 'N/A';
  }

  // Open nutrition modal directly
  openNutritionModal(content: any): void {
    if (this.nutritionInfo) {
      this.modalService.open(content, { size: 'lg', centered: true });
    } else {
      alert(
        'No nutrition information available yet. Please select a menu item first.'
      );
    }
  }
}
