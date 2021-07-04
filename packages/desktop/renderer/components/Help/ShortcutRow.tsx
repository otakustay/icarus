import styled from 'styled-components';

const Keyboard = styled.span`
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    padding: 0 12px;
    border: 1px solid var(--color-panel-text);
    font-family: monospace;
`;

const KeyboardList = styled.div`
    grid-area: keys;
    display: flex;
    gap: 8px;
`;

const Description = styled.div`
    grid-area: description;
    font-size: 14px;
`;

const Tooltip = styled.div`
    grid-area: tooltip;
    font-size: 12px;
    line-height: 1.5;
    color: var(--color-panel-text);
`;

const Layout = styled.div`
    display: grid;
    grid-template:
        "description keys"
        "tooltip keys" auto / 1fr auto;
    align-items: center;
    justify-content: space-between;
    color: var(--color-panel-contrast-text);
`;

interface Props {
    description: string;
    tooltip?: string;
    keys: string[];
}

export default function ShortcutRow({description, tooltip, keys}: Props) {
    return (
        <Layout>
            <Description>{description}</Description>
            <Tooltip>{tooltip}</Tooltip>
            <KeyboardList>
                {keys.map(v => <Keyboard key={v}>{v}</Keyboard>)}
            </KeyboardList>
        </Layout>
    );
}
