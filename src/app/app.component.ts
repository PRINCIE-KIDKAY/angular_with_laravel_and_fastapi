import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

interface Product {
  name: string;
  product_id: number;
  price: string;
}

interface ApiResponse {
  data: {
    current_page: number;
    data: Product[];
    first_page_url: string;
    from: number;
    last_page: any;
    last_page_url: string;
    links: { url: string | null; label: string; active: boolean }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  products: Product[] = [];
  currentPage: any = 1;
  totalPages: number = 1;
  paginationLinks: { url: string | null; label: string; active: boolean }[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchData(this.currentPage);
  }

  limit: any = 10;
  last_page:any=""

  fetchData(pageNumber: number) {
    let url = "http://localhost:8000/api/v1/eloquent_products/products_table";
    this.http.post<ApiResponse>(url, {
      "page": pageNumber,
      "limit": this.limit
    })
      .subscribe(response => {
        console.log(response)
        this.products = response.data.data;
        this.currentPage = response.data.current_page;
        this.totalPages = response.data.last_page;
        this.paginationLinks = response.data.links;
        this.last_page = response.data.last_page
      });
  }

  goToPage(pageNumber: any) {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.fetchData(pageNumber);
    }
  }

  isActive(pageNumber: any): boolean {
    return this.currentPage === pageNumber;
  }
  isPageNumber(label: string): boolean {
    return !isNaN(parseInt(label)); // Check if parsing to integer results in a number
  }
}
