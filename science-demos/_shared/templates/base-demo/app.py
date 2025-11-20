"""
My Scientific Demo - Python Backend
Runs entirely in the browser via Pyodide

Replace this docstring with your demo's description.
"""

import numpy as np
# Import other packages as needed:
# from scipy import stats
# import pandas as pd
# import sympy as sp

def example_function(param):
    """
    Example function that performs some calculation
    
    Args:
        param: Input parameter
    
    Returns:
        dict with results
    """
    # Your Python logic here
    data = np.random.randn(100) * param
    
    result = {
        'mean': float(np.mean(data)),
        'std': float(np.std(data)),
        'data': data[:10].tolist()  # First 10 values
    }
    
    return result

def another_function(x, y):
    """
    Another example function
    """
    return x + y

# List functions you want to expose to JavaScript
__all__ = [
    'example_function',
    'another_function'
]
