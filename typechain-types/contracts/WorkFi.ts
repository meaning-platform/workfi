/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../common";

export declare namespace IWorkFi {
  export type BountyMetadataStruct = {
    stablePay: PromiseOrValue<BigNumberish>;
    nativePay: PromiseOrValue<BigNumberish>;
    exchangeRate: PromiseOrValue<BigNumberish>;
    nativeToken: PromiseOrValue<string>;
    worker: PromiseOrValue<string>;
    recruiter: PromiseOrValue<string>;
    isCompleted: PromiseOrValue<boolean>;
    deadline: PromiseOrValue<BigNumberish>;
    hasWorkerBeenPaid: PromiseOrValue<boolean>;
  };

  export type BountyMetadataStructOutput = [
    BigNumber,
    BigNumber,
    BigNumber,
    string,
    string,
    string,
    boolean,
    BigNumber,
    boolean
  ] & {
    stablePay: BigNumber;
    nativePay: BigNumber;
    exchangeRate: BigNumber;
    nativeToken: string;
    worker: string;
    recruiter: string;
    isCompleted: boolean;
    deadline: BigNumber;
    hasWorkerBeenPaid: boolean;
  };
}

export interface WorkFiInterface extends utils.Interface {
  functions: {
    "acceptPayment(uint256)": FunctionFragment;
    "acceptWorker(uint256,address)": FunctionFragment;
    "createBounty(uint128,uint128,uint96,address,uint256)": FunctionFragment;
    "getBounty(uint256)": FunctionFragment;
    "getInvestment(uint256)": FunctionFragment;
    "invest(uint256,uint128)": FunctionFragment;
    "markBountyAsCompleted(uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "acceptPayment"
      | "acceptWorker"
      | "createBounty"
      | "getBounty"
      | "getInvestment"
      | "invest"
      | "markBountyAsCompleted"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "acceptPayment",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "acceptWorker",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "createBounty",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getBounty",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getInvestment",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "invest",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "markBountyAsCompleted",
    values: [PromiseOrValue<BigNumberish>]
  ): string;

  decodeFunctionResult(
    functionFragment: "acceptPayment",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "acceptWorker",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createBounty",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getBounty", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getInvestment",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "invest", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "markBountyAsCompleted",
    data: BytesLike
  ): Result;

  events: {
    "BountyCreated(uint256,address)": EventFragment;
    "Invested(uint256,address,uint256)": EventFragment;
    "WorkerAccepted(uint256,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "BountyCreated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Invested"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "WorkerAccepted"): EventFragment;
}

export interface BountyCreatedEventObject {
  bountyId: BigNumber;
  recruiter: string;
}
export type BountyCreatedEvent = TypedEvent<
  [BigNumber, string],
  BountyCreatedEventObject
>;

export type BountyCreatedEventFilter = TypedEventFilter<BountyCreatedEvent>;

export interface InvestedEventObject {
  bountyId: BigNumber;
  investor: string;
  amount: BigNumber;
}
export type InvestedEvent = TypedEvent<
  [BigNumber, string, BigNumber],
  InvestedEventObject
>;

export type InvestedEventFilter = TypedEventFilter<InvestedEvent>;

export interface WorkerAcceptedEventObject {
  bountyId: BigNumber;
  worker: string;
}
export type WorkerAcceptedEvent = TypedEvent<
  [BigNumber, string],
  WorkerAcceptedEventObject
>;

export type WorkerAcceptedEventFilter = TypedEventFilter<WorkerAcceptedEvent>;

export interface WorkFi extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: WorkFiInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    acceptPayment(
      bountyId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    acceptWorker(
      bountyId: PromiseOrValue<BigNumberish>,
      worker: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    createBounty(
      stablePay: PromiseOrValue<BigNumberish>,
      nativePay: PromiseOrValue<BigNumberish>,
      exchangeRate: PromiseOrValue<BigNumberish>,
      nativeToken: PromiseOrValue<string>,
      deadline: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getBounty(
      bountyId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[IWorkFi.BountyMetadataStructOutput]>;

    getInvestment(
      bountyId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    invest(
      bountyId: PromiseOrValue<BigNumberish>,
      stableAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    markBountyAsCompleted(
      bountyId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  acceptPayment(
    bountyId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  acceptWorker(
    bountyId: PromiseOrValue<BigNumberish>,
    worker: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  createBounty(
    stablePay: PromiseOrValue<BigNumberish>,
    nativePay: PromiseOrValue<BigNumberish>,
    exchangeRate: PromiseOrValue<BigNumberish>,
    nativeToken: PromiseOrValue<string>,
    deadline: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getBounty(
    bountyId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<IWorkFi.BountyMetadataStructOutput>;

  getInvestment(
    bountyId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  invest(
    bountyId: PromiseOrValue<BigNumberish>,
    stableAmount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  markBountyAsCompleted(
    bountyId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    acceptPayment(
      bountyId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    acceptWorker(
      bountyId: PromiseOrValue<BigNumberish>,
      worker: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    createBounty(
      stablePay: PromiseOrValue<BigNumberish>,
      nativePay: PromiseOrValue<BigNumberish>,
      exchangeRate: PromiseOrValue<BigNumberish>,
      nativeToken: PromiseOrValue<string>,
      deadline: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getBounty(
      bountyId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<IWorkFi.BountyMetadataStructOutput>;

    getInvestment(
      bountyId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    invest(
      bountyId: PromiseOrValue<BigNumberish>,
      stableAmount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    markBountyAsCompleted(
      bountyId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "BountyCreated(uint256,address)"(
      bountyId?: PromiseOrValue<BigNumberish> | null,
      recruiter?: PromiseOrValue<string> | null
    ): BountyCreatedEventFilter;
    BountyCreated(
      bountyId?: PromiseOrValue<BigNumberish> | null,
      recruiter?: PromiseOrValue<string> | null
    ): BountyCreatedEventFilter;

    "Invested(uint256,address,uint256)"(
      bountyId?: PromiseOrValue<BigNumberish> | null,
      investor?: PromiseOrValue<string> | null,
      amount?: null
    ): InvestedEventFilter;
    Invested(
      bountyId?: PromiseOrValue<BigNumberish> | null,
      investor?: PromiseOrValue<string> | null,
      amount?: null
    ): InvestedEventFilter;

    "WorkerAccepted(uint256,address)"(
      bountyId?: PromiseOrValue<BigNumberish> | null,
      worker?: PromiseOrValue<string> | null
    ): WorkerAcceptedEventFilter;
    WorkerAccepted(
      bountyId?: PromiseOrValue<BigNumberish> | null,
      worker?: PromiseOrValue<string> | null
    ): WorkerAcceptedEventFilter;
  };

  estimateGas: {
    acceptPayment(
      bountyId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    acceptWorker(
      bountyId: PromiseOrValue<BigNumberish>,
      worker: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    createBounty(
      stablePay: PromiseOrValue<BigNumberish>,
      nativePay: PromiseOrValue<BigNumberish>,
      exchangeRate: PromiseOrValue<BigNumberish>,
      nativeToken: PromiseOrValue<string>,
      deadline: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getBounty(
      bountyId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getInvestment(
      bountyId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    invest(
      bountyId: PromiseOrValue<BigNumberish>,
      stableAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    markBountyAsCompleted(
      bountyId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    acceptPayment(
      bountyId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    acceptWorker(
      bountyId: PromiseOrValue<BigNumberish>,
      worker: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    createBounty(
      stablePay: PromiseOrValue<BigNumberish>,
      nativePay: PromiseOrValue<BigNumberish>,
      exchangeRate: PromiseOrValue<BigNumberish>,
      nativeToken: PromiseOrValue<string>,
      deadline: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getBounty(
      bountyId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getInvestment(
      bountyId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    invest(
      bountyId: PromiseOrValue<BigNumberish>,
      stableAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    markBountyAsCompleted(
      bountyId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
