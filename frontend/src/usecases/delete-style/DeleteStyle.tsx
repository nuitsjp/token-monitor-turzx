import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Group, Modal, Stack, Text } from '@mantine/core';
import { deleteStyle, type StyleDefinition } from '../../features/styles/catalog';
import { ErrorNotice } from '../../shared/ErrorNotice';

export function DeleteStyle({ style }: { style: StyleDefinition }) {
  const client = useQueryClient();
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState<unknown>(null);
  async function confirm() {
    try {
      await deleteStyle(style.id);
      setError(null);
      setAsking(false);
      await client.invalidateQueries({ queryKey: ['styles', 'catalog'] });
    } catch (failure) {
      setError(failure);
      setAsking(false);
    }
  }
  return <>
    <Button variant="default" size="xs" color="red" onClick={() => setAsking(true)} aria-label={`Delete ${style.name}`}>Delete</Button>
    <Modal opened={asking} onClose={() => setAsking(false)} title="Delete this style?" centered>
      <Stack gap="md">
        <Text>{style.name}</Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={() => setAsking(false)}>Cancel</Button>
          <Button color="red" onClick={() => void confirm()}>Delete</Button>
        </Group>
      </Stack>
    </Modal>
    <ErrorNotice error={error} />
  </>;
}
