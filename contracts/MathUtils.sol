// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

library MathUtils {

    /// Calculates the percentage of a value. E.g 10% of 200 will return 20
    /// @param value the value to calculate the percentage of
    /// @param percentage in basis point, e.g 0.27% = 27
	/// @return PercentageValue of the value
	function calculatePercentage(uint256 value, uint256 percentage) external pure returns (uint256) {
		return (value * percentage) / 10000;
	}
}