export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string | null;
  image?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Publisher {
  id: number;
  name: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  image?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Genre {
  id: number;
  name: string;
  description?: string | null;
  image?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Author {
  id: number;
  full_name: string;
  biography?: string | null;
  image?: string | null;
  created_at?: string;
  updated_at?: string;
  books?: Book[];
}

export interface BookDetail {
  id: number;
  book_id: number;
  language?: string | null;
  pages?: string | null;
  weight?: string | null;
  dimensions?: string | null;
  edition?: string | null;
  isbn13?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type InventoryCondition = 'nuevo' | 'usado' | 'deteriorado';
export type InventoryStatus = 'disponible' | 'prestado' | 'reservado' | 'perdido' | 'danado';

export interface Inventory {
  id: number;
  book_id: number;
  quantity: number;
  condition?: InventoryCondition | null;
  location?: string | null;
  status?: InventoryStatus | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Book {
  id: number;
  title: string;
  isbn: string;
  folio: string;
  publication_year?: number | null;
  cover_image?: string | null;
  description?: string | null;
  category_id?: number | null;
  publisher_id?: number | null;
  genre_id?: number | null;
  created_at?: string;
  updated_at?: string;
  // Relaciones (Laravel las convierte a snake_case automáticamente)
  category?: Category;
  publisher?: Publisher;
  genre?: Genre;
  book_details?: BookDetail;
  inventory?: Inventory;
  authors?: Author[];
  is_available?: boolean;
  can_reserve?: boolean;
  availability_status?: string;
}

export interface PaginationLinks {
  first?: string | null;
  last?: string | null;
  prev?: string | null;
  next?: string | null;
}
export interface PaginationMeta {
  current_page: number;
  from?: number | null;
  last_page: number;
  path: string;
  per_page: number;
  to?: number | null;
  total: number;
}

export interface Reservation {
  id: number;
  user_id: number;
  book_id: number;
  status: string;
  reason: string;
  reserved_at: string;
  expires_at: string;
  approved_at: string | null;
  approved_by: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  planned_return_date: string;
  book: Book;
  user: User;
}
export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface Loan {
  id: number;
  user_id: number;
  book_id: number;
  status: string;
  borrowed_at: string;
  due_date: string;
  returned_at: string | null;
  book: Book;
  user: User;
}



export interface AlertState {
  isVisible: boolean;
  message: string;
  type: 'success' | 'error';
}
