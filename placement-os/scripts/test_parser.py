import unittest
from extract_rs_aggarwal import parse_block_content

class TestSequentialOptionParser(unittest.TestCase):
    
    def test_standard_options(self):
        lines = [
            "  ( a) 12 (b) 1",
            "  ( c) 35 (d) 7"
        ]
        q_text, opts = parse_block_content(lines)
        self.assertEqual(opts, ["12", "1", "35", "7"])
        self.assertEqual(q_text, "")
        
    def test_multi_line_leaked_denominators(self):
        lines = [
            "  ( a) 2  ( b) 1",
            "2",
            "  ( c) 3  ( d) 1",
            "3"
        ]
        q_text, opts = parse_block_content(lines)
        # Check that leaked denominators are correctly grouped into their options
        self.assertEqual(opts, ["2", "1 2", "3", "1 3"])
        self.assertEqual(q_text, "")
        
    def test_parentheses_in_option_values(self):
        lines = [
            "  ( a) (47 – 43) (b) (47 + 43)",
            "  ( c) (47 43 + 43 43) ( d) None of these"
        ]
        q_text, opts = parse_block_content(lines)
        # Check that parentheses within option text are preserved and not split
        self.assertEqual(opts, ["(47 – 43)", "(47 + 43)", "(47 43 + 43 43)", "None of these"])
        self.assertEqual(q_text, "")
        
    def test_option_reference_leaks(self):
        lines = [
            "  ( a) divisible by 11 (b) divisible by 9 ",
            "  ( c) necessarily irrational (d) Both ( a) and ( b)"
        ]
        q_text, opts = parse_block_content(lines)
        # Check that references like (a) and (b) inside option (d) are NOT parsed as option declarations
        self.assertEqual(opts, [
            "divisible by 11",
            "divisible by 9",
            "necessarily irrational",
            "Both ( a) and ( b)"
        ])
        self.assertEqual(q_text, "")

if __name__ == "__main__":
    unittest.main()
