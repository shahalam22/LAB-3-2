package io;

import junit.framework.TestCase;
import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;

import java.io.IOException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;

public class FileIOTest {
    private FileIO fileIO;

    @Rule
    public TemporaryFolder tempFolder = new TemporaryFolder();

    @Before
    public void setUp() {
        fileIO = new FileIO();
    }

    @Test(expected = IllegalArgumentException.class)
    public void testReadFileNonExistentFile() {
        String nonExistentPath = tempFolder.getRoot().toString() + "/nonexistent.txt";
        try {
            fileIO.readFile(nonExistentPath);
            fail("Should throw IllegalArgumentException for non-existent file");
        } catch (IllegalArgumentException e) {
            assertEquals("Input file does not exist", e.getMessage());
            throw e;
        }
    }

    @Test(expected = IllegalArgumentException.class)
    public void testReadFileEmptyFile() throws IOException {
        String emptyFilePath = "/home/shahalam22/Desktop/LAB-3-2/Software Testing/unittesting/src/test/resources/empty_file.txt";
        try {
            fileIO.readFile(emptyFilePath);
            fail("Should throw IllegalArgumentException for empty file");
        } catch (IllegalArgumentException e) {
            assertEquals("Given file is empty", e.getMessage());
            throw e;
        }
    }

    @Test(expected = AssertionError.class)
    public void testReadFileInvalidFile() {
        String emptyFilePath = "/home/shahalam22/Desktop/LAB-3-2/Software Testing/unittesting/src/test/resources/grades_invalid.txt";
        try {
            fileIO.readFile(emptyFilePath);
            fail("Should throw IllegalArgumentException for empty file");
        } catch (AssertionError e) {
            assertEquals("Given file is empty", e.getMessage());
            System.out.println(e.getMessage());
            throw e;
        }
    }
}