/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
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

export interface DeadlineUtilsInterface extends utils.Interface {
  functions: {
    "getDaysBeforeDate(uint256,uint256)": FunctionFragment;
    "getDaysBeforeInvestmentOpportunityDeadline(uint256,uint256,uint256,uint256)": FunctionFragment;
    "getInvestmentOpportunityDeadline(uint256,uint256,uint256)": FunctionFragment;
    "isWorkerDeadlineExpired(uint256)": FunctionFragment;
    "revertIfWorkerDeadlineIsInvalid(uint256,uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "getDaysBeforeDate"
      | "getDaysBeforeInvestmentOpportunityDeadline"
      | "getInvestmentOpportunityDeadline"
      | "isWorkerDeadlineExpired"
      | "revertIfWorkerDeadlineIsInvalid"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "getDaysBeforeDate",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getDaysBeforeInvestmentOpportunityDeadline",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getInvestmentOpportunityDeadline",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "isWorkerDeadlineExpired",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "revertIfWorkerDeadlineIsInvalid",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;

  decodeFunctionResult(
    functionFragment: "getDaysBeforeDate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getDaysBeforeInvestmentOpportunityDeadline",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getInvestmentOpportunityDeadline",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isWorkerDeadlineExpired",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "revertIfWorkerDeadlineIsInvalid",
    data: BytesLike
  ): Result;

  events: {};
}

export interface DeadlineUtils extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: DeadlineUtilsInterface;

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
    getDaysBeforeDate(
      nowAsUnixSeconds: PromiseOrValue<BigNumberish>,
      dateAsUnixSeconds: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getDaysBeforeInvestmentOpportunityDeadline(
      bountyCreationDate: PromiseOrValue<BigNumberish>,
      nowAsUnixSeconds: PromiseOrValue<BigNumberish>,
      workerDeadline: PromiseOrValue<BigNumberish>,
      investmentOpportunityPercentage: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getInvestmentOpportunityDeadline(
      bountyCreationDate: PromiseOrValue<BigNumberish>,
      workerDeadline: PromiseOrValue<BigNumberish>,
      investmentOpportunityPercentage: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    isWorkerDeadlineExpired(
      workerDeadline: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    revertIfWorkerDeadlineIsInvalid(
      bountyCreationDate: PromiseOrValue<BigNumberish>,
      workerDeadline: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[void]>;
  };

  getDaysBeforeDate(
    nowAsUnixSeconds: PromiseOrValue<BigNumberish>,
    dateAsUnixSeconds: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getDaysBeforeInvestmentOpportunityDeadline(
    bountyCreationDate: PromiseOrValue<BigNumberish>,
    nowAsUnixSeconds: PromiseOrValue<BigNumberish>,
    workerDeadline: PromiseOrValue<BigNumberish>,
    investmentOpportunityPercentage: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getInvestmentOpportunityDeadline(
    bountyCreationDate: PromiseOrValue<BigNumberish>,
    workerDeadline: PromiseOrValue<BigNumberish>,
    investmentOpportunityPercentage: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  isWorkerDeadlineExpired(
    workerDeadline: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  revertIfWorkerDeadlineIsInvalid(
    bountyCreationDate: PromiseOrValue<BigNumberish>,
    workerDeadline: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<void>;

  callStatic: {
    getDaysBeforeDate(
      nowAsUnixSeconds: PromiseOrValue<BigNumberish>,
      dateAsUnixSeconds: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getDaysBeforeInvestmentOpportunityDeadline(
      bountyCreationDate: PromiseOrValue<BigNumberish>,
      nowAsUnixSeconds: PromiseOrValue<BigNumberish>,
      workerDeadline: PromiseOrValue<BigNumberish>,
      investmentOpportunityPercentage: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getInvestmentOpportunityDeadline(
      bountyCreationDate: PromiseOrValue<BigNumberish>,
      workerDeadline: PromiseOrValue<BigNumberish>,
      investmentOpportunityPercentage: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isWorkerDeadlineExpired(
      workerDeadline: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    revertIfWorkerDeadlineIsInvalid(
      bountyCreationDate: PromiseOrValue<BigNumberish>,
      workerDeadline: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    getDaysBeforeDate(
      nowAsUnixSeconds: PromiseOrValue<BigNumberish>,
      dateAsUnixSeconds: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getDaysBeforeInvestmentOpportunityDeadline(
      bountyCreationDate: PromiseOrValue<BigNumberish>,
      nowAsUnixSeconds: PromiseOrValue<BigNumberish>,
      workerDeadline: PromiseOrValue<BigNumberish>,
      investmentOpportunityPercentage: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getInvestmentOpportunityDeadline(
      bountyCreationDate: PromiseOrValue<BigNumberish>,
      workerDeadline: PromiseOrValue<BigNumberish>,
      investmentOpportunityPercentage: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isWorkerDeadlineExpired(
      workerDeadline: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    revertIfWorkerDeadlineIsInvalid(
      bountyCreationDate: PromiseOrValue<BigNumberish>,
      workerDeadline: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getDaysBeforeDate(
      nowAsUnixSeconds: PromiseOrValue<BigNumberish>,
      dateAsUnixSeconds: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getDaysBeforeInvestmentOpportunityDeadline(
      bountyCreationDate: PromiseOrValue<BigNumberish>,
      nowAsUnixSeconds: PromiseOrValue<BigNumberish>,
      workerDeadline: PromiseOrValue<BigNumberish>,
      investmentOpportunityPercentage: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getInvestmentOpportunityDeadline(
      bountyCreationDate: PromiseOrValue<BigNumberish>,
      workerDeadline: PromiseOrValue<BigNumberish>,
      investmentOpportunityPercentage: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isWorkerDeadlineExpired(
      workerDeadline: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    revertIfWorkerDeadlineIsInvalid(
      bountyCreationDate: PromiseOrValue<BigNumberish>,
      workerDeadline: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}