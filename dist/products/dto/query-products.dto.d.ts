export declare enum ProductSort {
    NEWEST = "newest",
    PRICE_ASC = "price_asc",
    PRICE_DESC = "price_desc",
    BEST_SELLING = "best_selling"
}
export declare class QueryProductsDto {
    search?: string;
    categoryId?: string;
    sort?: ProductSort;
    page?: number;
    limit?: number;
}
