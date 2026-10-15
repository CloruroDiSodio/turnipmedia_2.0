export interface Book {
    // Two entries ("1984", "4321") have numeric titles in the JSON source,
    // so this mirrors the real data shape.
    Titolo: string | number;
    Autore: string;
    "Casa editrice": string;
    Lingua: string;
    Genere: string;
    Note: string;
    Letto: string;
    "321/588 Letti": string;
    "55% Letti su totale": string;
}
