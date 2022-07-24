
export interface AddressRegistry {
    networks: Networks;
}

export interface Networks {
    [networkName: string]: NetworkAddressRegistry
}

export interface NetworkAddressRegistry {
    mathUtils: string
    deadlineUtils: string
    bountyUtils: string
    workFi: string
}
