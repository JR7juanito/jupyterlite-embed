"""
Statistical Computing Demo - Python Backend
Runs entirely in the browser via Pyodide
"""

import numpy as np
from scipy import stats
import json

def generate_distribution(dist_type, size, param1, param2):
    """
    Generate random samples from specified distribution
    
    Args:
        dist_type: 'normal', 'uniform', 'exponential', 'poisson'
        size: number of samples
        param1: first parameter (mean, lower bound, rate, lambda)
        param2: second parameter (std, upper bound, unused, unused)
    
    Returns:
        dict with data and statistics
    """
    # Generate data based on distribution type
    if dist_type == 'normal':
        data = np.random.normal(param1, param2, size)
    elif dist_type == 'uniform':
        data = np.random.uniform(param1, param2, size)
    elif dist_type == 'exponential':
        data = np.random.exponential(param1, size)
    elif dist_type == 'poisson':
        data = np.random.poisson(max(0.1, param1), size)
    else:
        raise ValueError(f"Unknown distribution: {dist_type}")
    
    # Calculate statistics
    statistics = {
        'mean': float(np.mean(data)),
        'std': float(np.std(data)),
        'median': float(np.median(data)),
        'variance': float(np.var(data)),
        'skewness': float(stats.skew(data)),
        'kurtosis': float(stats.kurtosis(data)),
        'min': float(np.min(data)),
        'max': float(np.max(data)),
        'q25': float(np.percentile(data, 25)),
        'q75': float(np.percentile(data, 75))
    }
    
    # Create histogram data
    hist, bin_edges = np.histogram(data, bins=30)
    histogram = {
        'counts': hist.tolist(),
        'edges': bin_edges.tolist()
    }
    
    return {
        'data': data[:20].tolist(),  # Return first 20 for preview
        'statistics': statistics,
        'histogram': histogram,
        'full_size': len(data)
    }

def perform_normality_test(data):
    """
    Perform Shapiro-Wilk normality test
    """
    stat, p_value = stats.shapiro(data)
    return {
        'statistic': float(stat),
        'p_value': float(p_value),
        'is_normal': p_value > 0.05
    }

def calculate_confidence_interval(data, confidence=0.95):
    """
    Calculate confidence interval for the mean
    """
    mean = np.mean(data)
    sem = stats.sem(data)
    interval = stats.t.interval(confidence, len(data)-1, loc=mean, scale=sem)
    
    return {
        'mean': float(mean),
        'lower': float(interval[0]),
        'upper': float(interval[1]),
        'confidence': confidence
    }

# Export functions for JavaScript access
__all__ = [
    'generate_distribution',
    'perform_normality_test',
    'calculate_confidence_interval'
]
