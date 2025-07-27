namespace FinanceTracker.Core.Exceptions;

public class DuplicateException(string entityType, string duplicatedValue)
    : Exception($"Entity of type {entityType} with the same unique value {duplicatedValue} already exists.");