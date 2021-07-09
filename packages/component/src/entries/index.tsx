import {useState, StrictMode} from 'react';
import {createRoot} from 'react-dom';
import {Global, css} from '@emotion/react';
import {IoChatbubblesOutline} from 'react-icons/io5';
import {useSwitch, useToggle} from '@huse/boolean';
import GlobalStyle from '@/components/GlobalStyle';
import Panel from '@/components/Panel';
import Tag from '@/components/Tag';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import Progress from '@/components/Progress';
import Loading from '@/components/Loading';
import Modal from '@/components/Modal';
import Input from '@/components/Input';

function App() {
    const [toastVisible, showToast, hideToast] = useSwitch();
    const [modalVisible, openModal, closeModal] = useSwitch();
    const [loadingVisible, toggleLoading] = useToggle();
    const [progress, setProgress] = useState(13);

    return (
        <StrictMode>
            <GlobalStyle />
            <Global
                styles={css`
                    body {
                        overflow: auto;
                    }
                `}
            />
            <div style={{padding: 40}}>
                <Panel as="main" style={{minHeight: 400, padding: 12}}>
                    <h1 style={{color: 'var(--color-panel-text-secondary)'}}>Icarus - 小薄本</h1>
                    <p style={{color: 'var(--color-panel-text)'}}>你的单手看本利器 - By otakustay</p>
                    <h2 style={{color: 'var(--color-panel-text-secondary)'}}>标签</h2>
                    <div style={{display: 'flex', gap: 8}}>
                        <Tag>普通标签</Tag>
                        <Tag active>已激活</Tag>
                        <Tag suggested>推荐中</Tag>
                        <Tag disabled>已禁用</Tag>
                    </div>
                    <h2 style={{color: 'var(--color-panel-text-secondary)'}}>按钮</h2>
                    <div style={{display: 'flex', gap: 16}}>
                        <Button type="primary">主要按钮</Button>
                        <Button>常态按钮</Button>
                    </div>
                    <h2 style={{color: 'var(--color-panel-text-secondary)'}}>输入框</h2>
                    <div style={{display: 'flex', gap: 16}}>
                        <Input bordered placeholder="等待输入……" />
                        <Input placeholder="无边框输入" />
                    </div>
                    <h2 style={{color: 'var(--color-panel-text-secondary)'}}>提示</h2>
                    <Button onClick={showToast}>显示提示信息</Button>
                    <h2 style={{color: 'var(--color-panel-text-secondary)'}}>进度条</h2>
                    <Progress total={24} current={progress} onChange={setProgress} />
                    <h2 style={{color: 'var(--color-panel-text-secondary)'}}>加载指示</h2>
                    <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
                        <Button onClick={toggleLoading}>切换加载指示</Button>
                        <div style={{flex: 1}}>
                            {loadingVisible && <Loading />}
                        </div>
                    </div>
                    <h2 style={{color: 'var(--color-panel-text-secondary)'}}>模态对话框</h2>
                    <Button onClick={openModal}>显示模态框</Button>
                </Panel>
            </div>
            {toastVisible && <Toast icon={<IoChatbubblesOutline />} onExit={hideToast}>这是提示信息</Toast>}
            {
                modalVisible && (
                    <div
                        style={{position: 'fixed', top: 0, left: 0, bottom: 0, right: 0, backgroundColor: '#000'}}
                    />
                )
            }
            <Modal visible={modalVisible} title="模态对话框" onClose={closeModal}>
                <p>模态对话框内可以放置需要用户专注配制的内容</p>
            </Modal>
        </StrictMode>
    );
}

const root = createRoot(document.body.appendChild(document.createElement('div')));
root.render(<App />);
