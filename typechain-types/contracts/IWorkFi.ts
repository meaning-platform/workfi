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
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../common";

export type BountyMetadataStruct = {
  workerStablePay: PromiseOrValue<BigNumberish>;
  workerNativePay: PromiseOrValue<BigNumberish>;
  exchangeRate: PromiseOrValue<BigNumberish>;
  stablecoin: PromiseOrValue<string>;
  nativeToken: PromiseOrValue<string>;
  dailyYieldPercentage: PromiseOrValue<BigNumberish>;
  worker: PromiseOrValue<string>;
  recruiter: PromiseOrValue<string>;
  status: PromiseOrValue<BigNumberish>;
  workerDeadline: PromiseOrValue<BigNumberish>;
  initialWorkerStablePay: PromiseOrValue<BigNumberish>;
  initialWorkerNativePay: PromiseOrValue<BigNumberish>;
  creationDate: PromiseOrValue<BigNumberish>;
  workerPaidAt: PromiseOrValue<BigNumberish>;
};

export type BountyMetadataStructOutput = [
  BigNumber,
  BigNumber,
  BigNumber,
  string,
  string,
  BigNumber,
  string,
  string,
  number,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber
] & {
  workerStablePay: BigNumber;
  workerNativePay: BigNumber;
  exchangeRate: BigNumber;
  stablecoin: string;
  nativeToken: string;
  dailyYieldPercentage: BigNumber;
  worker: string;
  recruiter: string;
  status: number;
  workerDeadline: BigNumber;
  initialWorkerStablePay: BigNumber;
  initialWorkerNativePay: BigNumber;
  creationDate: BigNumber;
  workerPaidAt: BigNumber;
};

export declare namespace IWorkFi {
  export type InvestmentMetadataStruct = {
    stableAmount: PromiseOrValue<BigNumberish>;
    creationDate: PromiseOrValue<BigNumberish>;
  };

  export type InvestmentMetadataStructOutput = [BigNumber, BigNumber] & {
    stableAmount: BigNumber;
    creationDate: BigNumber;
  };
}

export interface IWorkFiInterface extends utils.Interface {
  functions: {
    "acceptInvestorPayment(uint256)": FunctionFragment;
    "acceptWorker(uint256,address)": FunctionFragment;
    "acceptWorkerPayment(uint256)": FunctionFragment;
    "calculateTotalYield(uint128,uint128,uint128)": FunctionFragment;
    "calculateYieldPool(uint128,uint128,uint256,uint256)": FunctionFragment;
    "cancelBounty(uint256)": FunctionFragment;
    "createBounty(uint128,uint128,uint96,address,address,uint128,uint256)": FunctionFragment;
    "getAmountOfInvestments(uint256)": FunctionFragment;
    "getBounty(uint256)": FunctionFragment;
    "getInvestment(uint256,uint256)": FunctionFragment;
    "invest(uint256,uint128)": FunctionFragment;
    "markBountyAsCompleted(uint256)": FunctionFragment;
    "withdrawInvestments(uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "acceptInvestorPayment"
      | "acceptWorker"
      | "acceptWorkerPayment"
      | "calculateTotalYield"
      | "calculateYieldPool"
      | "cancelBounty"
      | "createBounty"
      | "getAmountOfInvestments"
      | "getBounty"
      | "getInvestment"
      | "invest"
      | "markBountyAsCompleted"
      | "withdrawInvestments"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "acceptInvestorPayment",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "acceptWorker",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "acceptWorkerPayment",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "calculateTotalYield",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "calculateYieldPool",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "cancelBounty",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "createBounty",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getAmountOfInvestments",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getBounty",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getInvestment",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "invest",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "markBountyAsCompleted",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawInvestments",
    values: [PromiseOrValue<BigNumberish>]
  ): string;

  decodeFunctionResult(
    functionFragment: "acceptInvestorPayment",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "acceptWorker",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "acceptWorkerPayment",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "calculateTotalYield",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "calculateYieldPool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "cancelBounty",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createBounty",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getAmountOfInvestments",
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
  decodeFunctionResult(
    functionFragment: "withdrawInvestments",
    data: BytesLike
  ): Result;

  events: {};
}

export interface IWorkFi extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IWorkFiInterface;

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
    acceptInvestorPayment(
      bountyId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    acceptWorker(
      bountyId: PromiseOrValue<BigNumberish>,
      worker: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    acceptWorkerPayment(
      bountyId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    calculateTotalYield(
      initialValue: PromiseOrValue<BigNumberish>,
      dailyYieldPercentage: PromiseOrValue<BigNumberish>,
      daysBeforeInvestmentOpportunityCloses: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    calculateYieldPool(
      workerNativePay: PromiseOrValue<BigNumberish>,
      dailyYieldPercentage: PromiseOrValue<BigNumberish>,
      bountyCreationDate: PromiseOrValue<BigNumberish>,
      workerDeadline: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    cancelBounty(
      bountyId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    createBounty(
      workerStablePay: PromiseOrValue<BigNumberish>,
      workerNativePay: PromiseOrValue<BigNumberish>,
      exchangeRate: PromiseOrValue<BigNumberish>,
      nativeToken: PromiseOrValue<string>,
      stablecoin: PromiseOrValue<string>,
      dailyYieldPercentage: PromiseOrValue<BigNumberish>,
      deadline: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getAmountOfInvestments(
      bountyId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getBounty(
      bountyId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BountyMetadataStructOutput]>;

    getInvestment(
      bountyId: PromiseOrValue<BigNumberish>,
      investmentId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[IWorkFi.InvestmentMetadataStructOutput]>;

    invest(
      bountyId: PromiseOrValue<BigNumberish>,
      stableAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    markBountyAsCompleted(
      bountyId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    withdrawInvestments(
      bountyId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  acceptInvestorPayment(
    bountyId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  acceptWorker(
    bountyId: PromiseOrValue<BigNumberish>,
    worker: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  acceptWorkerPayment(
    bountyId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  calculateTotalYield(
    initialValue: PromiseOrValue<BigNumberish>,
    dailyYieldPercentage: PromiseOrValue<BigNumberish>,
    daysBeforeInvestmentOpportunityCloses: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  calculateYieldPool(
    workerNativePay: PromiseOrValue<BigNumberish>,
    dailyYieldPercentage: PromiseOrValue<BigNumberish>,
    bountyCreationDate: PromiseOrValue<BigNumberish>,
    workerDeadline: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  cancelBounty(
    bountyId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  createBounty(
    workerStablePay: PromiseOrValue<BigNumberish>,
    workerNativePay: PromiseOrValue<BigNumberish>,
    exchangeRate: PromiseOrValue<BigNumberish>,
    nativeToken: PromiseOrValue<string>,
    stablecoin: PromiseOrValue<string>,
    dailyYieldPercentage: PromiseOrValue<BigNumberish>,
    deadline: PromiseOrValue<BigNumberish>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getAmountOfInvestments(
    bountyId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getBounty(
    bountyId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BountyMetadataStructOutput>;

  getInvestment(
    bountyId: PromiseOrValue<BigNumberish>,
    investmentId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<IWorkFi.InvestmentMetadataStructOutput>;

  invest(
    bountyId: PromiseOrValue<BigNumberish>,
    stableAmount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  markBountyAsCompleted(
    bountyId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  withdrawInvestments(
    bountyId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    acceptInvestorPayment(
      bountyId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    acceptWorker(
      bountyId: PromiseOrValue<BigNumberish>,
      worker: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    acceptWorkerPayment(
      bountyId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    calculateTotalYield(
      initialValue: PromiseOrValue<BigNumberish>,
      dailyYieldPercentage: PromiseOrValue<BigNumberish>,
      daysBeforeInvestmentOpportunityCloses: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    calculateYieldPool(
      workerNativePay: PromiseOrValue<BigNumberish>,
      dailyYieldPercentage: PromiseOrValue<BigNumberish>,
      bountyCreationDate: PromiseOrValue<BigNumberish>,
      workerDeadline: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    cancelBounty(
      bountyId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    createBounty(
      workerStablePay: PromiseOrValue<BigNumberish>,
      workerNativePay: PromiseOrValue<BigNumberish>,
      exchangeRate: PromiseOrValue<BigNumberish>,
      nativeToken: PromiseOrValue<string>,
      stablecoin: PromiseOrValue<string>,
      dailyYieldPercentage: PromiseOrValue<BigNumberish>,
      deadline: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getAmountOfInvestments(
      bountyId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getBounty(
      bountyId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BountyMetadataStructOutput>;

    getInvestment(
      bountyId: PromiseOrValue<BigNumberish>,
      investmentId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<IWorkFi.InvestmentMetadataStructOutput>;

    invest(
      bountyId: PromiseOrValue<BigNumberish>,
      stableAmount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    markBountyAsCompleted(
      bountyId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    withdrawInvestments(
      bountyId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    acceptInvestorPayment(
      bountyId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    acceptWorker(
      bountyId: PromiseOrValue<BigNumberish>,
      worker: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    acceptWorkerPayment(
      bountyId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    calculateTotalYield(
      initialValue: PromiseOrValue<BigNumberish>,
      dailyYieldPercentage: PromiseOrValue<BigNumberish>,
      daysBeforeInvestmentOpportunityCloses: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    calculateYieldPool(
      workerNativePay: PromiseOrValue<BigNumberish>,
      dailyYieldPercentage: PromiseOrValue<BigNumberish>,
      bountyCreationDate: PromiseOrValue<BigNumberish>,
      workerDeadline: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    cancelBounty(
      bountyId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    createBounty(
      workerStablePay: PromiseOrValue<BigNumberish>,
      workerNativePay: PromiseOrValue<BigNumberish>,
      exchangeRate: PromiseOrValue<BigNumberish>,
      nativeToken: PromiseOrValue<string>,
      stablecoin: PromiseOrValue<string>,
      dailyYieldPercentage: PromiseOrValue<BigNumberish>,
      deadline: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getAmountOfInvestments(
      bountyId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getBounty(
      bountyId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getInvestment(
      bountyId: PromiseOrValue<BigNumberish>,
      investmentId: PromiseOrValue<BigNumberish>,
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

    withdrawInvestments(
      bountyId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    acceptInvestorPayment(
      bountyId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    acceptWorker(
      bountyId: PromiseOrValue<BigNumberish>,
      worker: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    acceptWorkerPayment(
      bountyId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    calculateTotalYield(
      initialValue: PromiseOrValue<BigNumberish>,
      dailyYieldPercentage: PromiseOrValue<BigNumberish>,
      daysBeforeInvestmentOpportunityCloses: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    calculateYieldPool(
      workerNativePay: PromiseOrValue<BigNumberish>,
      dailyYieldPercentage: PromiseOrValue<BigNumberish>,
      bountyCreationDate: PromiseOrValue<BigNumberish>,
      workerDeadline: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    cancelBounty(
      bountyId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    createBounty(
      workerStablePay: PromiseOrValue<BigNumberish>,
      workerNativePay: PromiseOrValue<BigNumberish>,
      exchangeRate: PromiseOrValue<BigNumberish>,
      nativeToken: PromiseOrValue<string>,
      stablecoin: PromiseOrValue<string>,
      dailyYieldPercentage: PromiseOrValue<BigNumberish>,
      deadline: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getAmountOfInvestments(
      bountyId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getBounty(
      bountyId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getInvestment(
      bountyId: PromiseOrValue<BigNumberish>,
      investmentId: PromiseOrValue<BigNumberish>,
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

    withdrawInvestments(
      bountyId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
