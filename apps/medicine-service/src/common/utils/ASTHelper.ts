import { SelectQueryBuilder, Brackets, ObjectLiteral, WhereExpressionBuilder } from 'typeorm';
import { Node, ComparisonNode, isComparisonNode, isLogicNode } from '@rsql/ast';

type QueryParams = Record<string, any>;

export function mapComparison(
    node: ComparisonNode,
    alias: string,
): { sql: string; params: QueryParams } {
    const field = `${alias}.${node.left.selector}`;
    const value = node.right.value;
    const key = node.left.selector;

    switch (node.operator) {
        case '==':
            return { sql: `${field} = :${key}`, params: { [key]: value } };
        case '!=':
            return { sql: `${field} != :${key}`, params: { [key]: value } };
        case '>':
            return { sql: `${field} > :${key}`, params: { [key]: value } };
        case '>=':
            return { sql: `${field} >= :${key}`, params: { [key]: value } };
        case '<':
            return { sql: `${field} < :${key}`, params: { [key]: value } };
        case '<=':
            return { sql: `${field} <= :${key}`, params: { [key]: value } };
        case '=in=':
            return { sql: `${field} IN (:...${key})`, params: { [key]: node.right.value } };
        case '=out=':
            return {
                sql: `${field} NOT IN (:...${key})`,
                params: { [key]: node.right.value },
            };
        case '==*':
            if (Array.isArray(value)) {
                throw new Error(`Operator '==*' (LIKE) cannot be applied to array`);
            }
            return { sql: `${field} LIKE :${key}`, params: { [key]: `%${value}%` } };
        default:
            throw new Error(`Unsupported operator: ${node.operator}`);
    }
}

function isWhereExpressionBuilder(obj: unknown): obj is WhereExpressionBuilder {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'andWhere' in obj &&
        typeof (obj as any).andWhere === 'function'
    );
}

export function applyRsql<T extends ObjectLiteral>(
    qb: SelectQueryBuilder<T> | WhereExpressionBuilder,
    node: Node,
    alias: string,
): void {
    if (!isWhereExpressionBuilder(qb)) {
        throw new Error('Query builder does not support andWhere');
    }
    if (isComparisonNode(node)) {
        const { sql, params } = mapComparison(node, alias);
        qb.andWhere(sql, params);
        return;
    }

    if (isLogicNode(node)) {
        if (node.operator === ';' || node.operator === 'and') {
            applyRsql(qb, node.left, alias);
            applyRsql(qb, node.right, alias);
        } else if (node.operator === ',' || node.operator === 'or') {
            qb.andWhere(
                new Brackets((sub: WhereExpressionBuilder) => {
                    applyRsql(sub, node.left, alias);
                    applyRsql(sub, node.right, alias);
                }),
            );
        }
    }
}
