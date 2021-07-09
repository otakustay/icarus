import styled from '@emotion/styled';
import {Loading} from '@icarus/component';
import {useRemotePending} from '@/components/RemoteContextProvider';

const Indicator = styled(Loading)`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 70;
`;

export default function PendingIndicator() {
    const pending = useRemotePending();

    return pending ? <Indicator /> : null;
}
