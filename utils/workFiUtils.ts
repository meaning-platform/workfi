import { WorkFi } from "../typechain-types";

// TODO: parsing events might get tedious, do caching later or use an API reading the blockchain for performance
export async function getWhitelistedStablecoins(workFi: WorkFi): Promise<Set<string>> {

    const stablecoinAddedFilter = workFi.filters.StablecoinAddedToWhitelist();
    const stablecoinRemovedFilter = workFi.filters.StablecoinRemovedFromWhitelist();
    const [added, removed] = await Promise.all([
        workFi.queryFilter(stablecoinAddedFilter),
        workFi.queryFilter(stablecoinRemovedFilter)
    ]);

    const whitelist = new Set<string>();
    for (let i = 0; i < added.length; i++) {
        whitelist.add(added[i].args.stablecoin);
    }
    for (let i = 0; i < removed.length; i++) {
        whitelist.delete(removed[i].args.stablecoin);
    }

    return whitelist;
}