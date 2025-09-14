export async function sendGet<T>(path: string) : Promise<T> {
    let response = await fetch(path);
    return await response.json();
}

export async function sendPost(path: string, body: any) : Promise<void> {
    let response = await fetch(path, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw new Error(`Failed to POST to ${path}`);
    }
}

export async function sendDelete(path: string) : Promise<void> {
    let response = await fetch(path, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to DELETE ${path}`);
    }
}