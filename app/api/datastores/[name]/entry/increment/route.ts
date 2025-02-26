// app/api/datastores/[name]/entry/increment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { incrementDataStoreEntry } from '@/lib/robloxApi';
import type { DatastoreResponse, ErrorResponse } from '@/types/api';

interface IncrementBody {
    entryKey: string;
    incrementBy: number;
    scope?: string;
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ name: string }> }
) {
    const { name: datastoreName } = await params;
    const { searchParams } = new URL(req.url);
    const universeId = searchParams.get('universeId');
    
    // Get API token from header first, fall back to query param
    const apiToken = req.headers.get("x-api-key") || searchParams.get('apiToken');

    if (!universeId || !apiToken) {
        return NextResponse.json<ErrorResponse>(
            { error: 'Missing universeId or apiToken' },
            { status: 400 }
        );
    }

    const body = await req.json() as IncrementBody;
    if (!body.entryKey || body.incrementBy === undefined) {
        return NextResponse.json<ErrorResponse>(
            { error: 'Missing entryKey or incrementBy' },
            { status: 400 }
        );
    }

    const result = await incrementDataStoreEntry(
        universeId,
        apiToken,
        datastoreName,
        body.entryKey,
        body.incrementBy,
        body.scope
    );
    return NextResponse.json<DatastoreResponse>(result);
}
