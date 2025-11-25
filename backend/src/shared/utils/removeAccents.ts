export async function removeAccents(s:string): Promise<string>{
    return s.normalize('NFD').replace(/[^a-zA-Z\s]/g, "");
}