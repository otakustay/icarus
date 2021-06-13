import Persistence from '../Persistence';
import MemoryCachedPersistence from '../MemoryCachedPersistence';

class TestPersistence implements Persistence {
    content: string = '';
    isOpen: boolean = false;

    async read() {
        return this.content;
    }

    async write(content: string) {
        this.content = content;
    }

    async clear() {
        this.content = '';
    }

    async open() {
        this.isOpen = true;
    }

    async close() {
        this.isOpen = false;
    }
}

test('open pass through', async () => {
    const next = new TestPersistence();
    const cached = new MemoryCachedPersistence(next);
    await cached.open();
    expect(next.isOpen).toBe(true);
});

test('close pass through', async () => {
    const next = new TestPersistence();
    const cached = new MemoryCachedPersistence(next);
    await cached.open();
    await cached.close();
    expect(next.isOpen).toBe(false);
});

test('clear pass through', async () => {
    const next = new TestPersistence();
    await next.write('123');
    const cached = new MemoryCachedPersistence(next);
    await cached.open();
    await cached.clear();
    const content = await next.read();
    expect(content).toBe('');
});

test('lazy read', async () => {
    const next = new TestPersistence();
    await next.write('123');
    const nextRead = jest.spyOn(next, 'read');
    const cached = new MemoryCachedPersistence(next);
    await cached.open();
    expect(nextRead).not.toHaveBeenCalled();
    const content = await cached.read();
    expect(content).toBe('123');
});

test('write through', async () => {
    const next = new TestPersistence();
    const cached = new MemoryCachedPersistence(next);
    await cached.open();
    await cached.write('123');
    const content = await cached.read();
    expect(content).toBe('123');
    const nextContent = await next.read();
    expect(nextContent).toBe('123');
});
