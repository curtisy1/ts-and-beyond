export type CurrentSort = {
    direction: "asc" | "desc";
    field: string;
}

export type File = {
    group: string;
    title: string;
    href: string;
    author: string;
    venue: string;
    presented: string;
    modified: string;
    size: string;
}