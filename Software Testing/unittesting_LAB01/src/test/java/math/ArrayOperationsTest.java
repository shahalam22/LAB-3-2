package math;

import org.junit.Before;
import org.junit.Test;

import io.FileIO;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

import static org.junit.Assert.*;

public class ArrayOperationsTest {
    private ArrayOperations arrayOps;
    private MyMath myMath;
    private FileIO fileIO;

    @Before
    public void setUp() {
        arrayOps = new ArrayOperations();
        myMath = new MyMath();
        fileIO = new FileIO();
    }

    @Test
    public void testFindPrimesInFile_ValidFile() throws IOException {
        // grades_valid.txt: 3,9,0,2,10,9,3,8,0,3
        int[] expected = {3, 2, 3}; // Prime numbers: 3,2,3
        int[] result = arrayOps.findPrimesInFile(fileIO, "/home/shahalam22/Desktop/LAB-3-2/Software Testing/unittesting/src/test/resources/grades_valid.txt", myMath);
        assertArrayEquals("Should return array of prime numbers from grades_valid.txt", expected, result);
    }

    @Test(expected = IllegalArgumentException.class)
    public void testFindPrimesInFile_EmptyFile() {
        // empty_file.txt: no numbers
        arrayOps.findPrimesInFile(fileIO, "/home/shahalam22/Desktop/LAB-3-2/Software Testing/unittesting/src/test/resources/empty_file.txt", myMath);
    }

    @Test
    public void testFindPrimesInFile_InvalidEntries() throws IOException {
        // grades_invalid.txt: 3,9,a,2,10,9.42,b,8,0,3
        // Valid integers: 3,9,2,10,8,0,3
        int[] expected = {3, 2, 3}; // Prime numbers: 3,2,3
        int[] result = arrayOps.findPrimesInFile(fileIO, "/home/shahalam22/Desktop/LAB-3-2/Software Testing/unittesting/src/test/resources/grades_invalid.txt", myMath);
        assertArrayEquals("Should handle invalid entries and return prime numbers", expected, result);
    }
}