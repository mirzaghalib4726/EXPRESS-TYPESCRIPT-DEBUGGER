import { error } from "console";
import { Request, Response } from "express";

const generateSum = (array: any) => {
  const result: any = [];

  // Recursive function to generate combinations
  function generate(
    currentIndex: any,
    currentCombination: any,
    remaining: any
  ) {
    if (remaining === 0) {
      const sum = currentCombination.reduce(
        (acc: any, val: any) => acc + val,
        0
      );
      result.push(sum);
      return;
    }

    for (let i = currentIndex; i < array.length; i++) {
      generate(i + 1, [...currentCombination, array[i]], remaining - 1);
    }
  }

  // Generate combinations for each length from 1 to array.length
  for (let length = 1; length <= array.length; length++) {
    generate(0, [], length);
  }

  return result;
};

export const sumArray = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = generateSum(data.arr);
    return res.status(200).json({ status: 200, data: result });
  } catch (e: any) {
    throw error(e);
  }
};

export const maxSubArray = (req: Request, res: Response) => {
  const { nums } = req.body;
  let maxSum = nums[0];
  let currentSum = nums[0];

  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }

  return res.status(200).json({ maxSum });
};
