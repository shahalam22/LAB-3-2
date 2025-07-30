package math;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import io.FileIO;

/**
 * The MyMath provides simple methods such as computing a factorial or finding
 * whether an integer is prime
 *
 * @author pandeliskirpoglou
 * @version 1.0
 * @since 2020-04-18
 */
public class ArrayOperations {

	/**
	 * Gets one integer and returns true if it is prime and false if it is not.
	 *
	 * @param fileio   instance for reading a file
	 * @param filepath path for file that needs to be checked
	 * @param myMath   instance for checking whether a number is prime
	 * @return arrayOfPrimeNumbers the array of prime numbers that were in the file
	 * @throws NullPointerException if fileio, filepath, or myMath is null
	 */
	public int[] findPrimesInFile(FileIO fileio, String filepath, MyMath myMath) {
		if (fileio == null) {
			throw new NullPointerException("FileIO cannot be null");
		}
		if (filepath == null) {
			throw new NullPointerException("File path cannot be null");
		}
		if (myMath == null) {
			throw new NullPointerException("MyMath cannot be null");
		}
		int[] arrayOfNumbers = fileio.readFile(filepath);
		List<Integer> arrayOfPrimeNumbers = new ArrayList<>();
		for (int i = 0; i < arrayOfNumbers.length; i++) {
			if (myMath.isPrime(arrayOfNumbers[i])) {
				arrayOfPrimeNumbers.add(arrayOfNumbers[i]);
			}
		}
		return arrayOfPrimeNumbers.stream().mapToInt(i -> i).toArray();
	}
}