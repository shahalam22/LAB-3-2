package io;

import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.PrintStream;

import static org.junit.Assert.*;

public class FileIOTest {
    private FileIO fileio;
    private final PrintStream originalErr = System.err;
    private ByteArrayOutputStream errContent;

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    @Before
    public void setUp() {
        fileio = new FileIO();
        errContent = new ByteArrayOutputStream();
        System.setErr(new PrintStream(errContent));
    }

    @After
    public void tearDown() {
        System.setErr(originalErr);
    }

    @Test
    public void read_empty_file() {
        try {
            fileio.readFile("src/test/resources/empty_file.txt");
            fail("Expected IllegalArgumentException");
        } catch (IllegalArgumentException e) {
            // Expected exception
        }
    }

    @Test
    public void test_io_exception() {
        File tempFile = new File("src/test/resources/restricted_file.txt");
        try {
            tempFile.createNewFile();
            tempFile.setReadable(false);

            try {
                fileio.readFile(tempFile.getPath());
                fail("Expected IllegalArgumentException");
            } catch (IllegalArgumentException e) {
                String errOutput = errContent.toString();
                assertTrue(errOutput.contains("java.io.FileNotFoundException") ||
                        errOutput.contains("Permission denied"));
            }
        } catch (IOException e) {
            e.printStackTrace();
            fail("Failed to create test file: " + e.getMessage());
        } finally {
            tempFile.setReadable(true);
            tempFile.delete();
        }
    }

    @Test
    public void non_existing_file() {
        try {
            fileio.readFile("/home/noFile.txt");
            fail("Expected IllegalArgumentException");
        } catch (IllegalArgumentException e) {
            // Expected
        }
    }

    @Test
    public void check_invalid_entries() {
        try {
            fileio.readFile("src/test/resources/grades_invalid.txt");
            fail("Expected NumberFormatException");
        } catch (NumberFormatException e) {
            // Expected
        }
    }

    @Test
    public void check_valid_entries() {
        int[] expected = {3, 9, 0, 2, 10, 9, 3, 8, 0, 3};
        int[] actual = fileio.readFile("src/test/resources/grades_valid.txt");
        assertArrayEquals(expected, actual);
    }
}
