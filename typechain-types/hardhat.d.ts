/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Ownable__factory>;
    getContractFactory(
      name: "ERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20__factory>;
    getContractFactory(
      name: "IERC20Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Metadata__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "IERC777",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC777__factory>;
    getContractFactory(
      name: "ISuperAgreement",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISuperAgreement__factory>;
    getContractFactory(
      name: "ISuperApp",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISuperApp__factory>;
    getContractFactory(
      name: "ISuperfluid",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISuperfluid__factory>;
    getContractFactory(
      name: "ISuperfluidGovernance",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISuperfluidGovernance__factory>;
    getContractFactory(
      name: "ISuperfluidToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISuperfluidToken__factory>;
    getContractFactory(
      name: "ISuperToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISuperToken__factory>;
    getContractFactory(
      name: "ISuperTokenFactory",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISuperTokenFactory__factory>;
    getContractFactory(
      name: "ERC20WithTokenInfo",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20WithTokenInfo__factory>;
    getContractFactory(
      name: "TokenInfo",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TokenInfo__factory>;
    getContractFactory(
      name: "DeadlineUtils",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DeadlineUtils__factory>;
    getContractFactory(
      name: "IWorkFi",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IWorkFi__factory>;
    getContractFactory(
      name: "MathUtils",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MathUtils__factory>;
    getContractFactory(
      name: "MockERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MockERC20__factory>;
    getContractFactory(
      name: "WorkFi",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.WorkFi__factory>;

    getContractAt(
      name: "Ownable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Ownable>;
    getContractAt(
      name: "ERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20>;
    getContractAt(
      name: "IERC20Metadata",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Metadata>;
    getContractAt(
      name: "IERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "IERC777",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC777>;
    getContractAt(
      name: "ISuperAgreement",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ISuperAgreement>;
    getContractAt(
      name: "ISuperApp",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ISuperApp>;
    getContractAt(
      name: "ISuperfluid",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ISuperfluid>;
    getContractAt(
      name: "ISuperfluidGovernance",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ISuperfluidGovernance>;
    getContractAt(
      name: "ISuperfluidToken",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ISuperfluidToken>;
    getContractAt(
      name: "ISuperToken",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ISuperToken>;
    getContractAt(
      name: "ISuperTokenFactory",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ISuperTokenFactory>;
    getContractAt(
      name: "ERC20WithTokenInfo",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20WithTokenInfo>;
    getContractAt(
      name: "TokenInfo",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.TokenInfo>;
    getContractAt(
      name: "DeadlineUtils",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.DeadlineUtils>;
    getContractAt(
      name: "IWorkFi",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IWorkFi>;
    getContractAt(
      name: "MathUtils",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.MathUtils>;
    getContractAt(
      name: "MockERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.MockERC20>;
    getContractAt(
      name: "WorkFi",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.WorkFi>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
  }
}
