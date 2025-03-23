package com.productapi.config;

import graphql.language.IntValue;
import graphql.language.StringValue;
import graphql.schema.Coercing;
import graphql.schema.CoercingParseLiteralException;
import graphql.schema.CoercingParseValueException;
import graphql.schema.CoercingSerializeException;

/**
 * Implementation of the Long scalar type for GraphQL
 * Handles conversion between GraphQL and Java Long values
 */
public class LongCoercing implements Coercing<Long, Long> {

    @Override
    public Long serialize(Object input) throws CoercingSerializeException {
        if (input instanceof Long) {
            return (Long) input;
        } else if (input instanceof Integer) {
            return ((Integer) input).longValue();
        } else if (input instanceof String) {
            try {
                return Long.parseLong((String) input);
            } catch (NumberFormatException e) {
                throw new CoercingSerializeException("Invalid Long value: " + input);
            }
        }
        throw new CoercingSerializeException("Expected type 'Long' but was '" + input.getClass().getSimpleName() + "'.");
    }

    @Override
    public Long parseValue(Object input) throws CoercingParseValueException {
        if (input instanceof Long) {
            return (Long) input;
        } else if (input instanceof Integer) {
            return ((Integer) input).longValue();
        } else if (input instanceof String) {
            try {
                return Long.parseLong((String) input);
            } catch (NumberFormatException e) {
                throw new CoercingParseValueException("Invalid Long value: " + input);
            }
        }
        throw new CoercingParseValueException("Expected type 'Long' but was '" + input.getClass().getSimpleName() + "'.");
    }

    @Override
    public Long parseLiteral(Object input) throws CoercingParseLiteralException {
        if (input instanceof IntValue) {
            return ((IntValue) input).getValue().longValue();
        } else if (input instanceof StringValue) {
            try {
                return Long.parseLong(((StringValue) input).getValue());
            } catch (NumberFormatException e) {
                throw new CoercingParseLiteralException("Invalid Long value: " + ((StringValue) input).getValue());
            }
        }
        throw new CoercingParseLiteralException("Expected AST type 'IntValue' or 'StringValue' but was '" + input.getClass().getSimpleName() + "'.");
    }
} 