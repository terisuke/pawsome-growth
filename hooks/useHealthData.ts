
import { Session } from '@supabase/supabase-js';
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Diary, Dog, FoodLog, WeightLog } from '../types';

export const useHealthData = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [activeDogId, setActiveDogId] = useState<string | null>(null);
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchInitialData = useCallback(async () => {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch dogs
      const { data: dogsData, error: dogsError } = await supabase
        .from('dogs')
        .select('*')
        .order('created_at', { ascending: true });

      if (dogsError) throw dogsError;
      const mappedDogs: Dog[] = (dogsData || []).map(d => ({
        id: d.id,
        name: d.name,
        breed: d.breed || '',
        image: d.image_url || '',
        birthday: d.birthday || '',
        ownerId: d.owner_id
      }));
      setDogs(mappedDogs);

      if (mappedDogs.length > 0 && !activeDogId) {
        setActiveDogId(mappedDogs[0].id);
      }

      // Fetch weight logs
      const { data: weightData, error: weightError } = await supabase
        .from('weight_logs')
        .select('*')
        .order('date', { ascending: true });

      if (weightError) throw weightError;
      setWeightLogs((weightData || []).map(w => ({
        id: w.id,
        dogId: w.dog_id,
        date: w.date,
        weight: Number(w.weight)
      })));

      // Fetch food logs
      const { data: foodData, error: foodError } = await supabase
        .from('food_logs')
        .select('*')
        .order('date', { ascending: true });

      if (foodError) throw foodError;
      setFoodLogs((foodData || []).map(f => ({
        id: f.id,
        dogId: f.dog_id,
        date: f.date,
        amount: Number(f.amount),
        memo: f.memo || ''
      })));

      // Fetch diaries
      const { data: diaryData, error: diaryError } = await supabase
        .from('diaries')
        .select('*')
        .order('date', { ascending: false });

      if (diaryError) throw diaryError;
      setDiaries((diaryData || []).map(d => ({
        id: d.id,
        dogId: d.dog_id,
        date: d.date,
        title: d.title,
        content: d.content || ''
      })));

    } catch (error) {
      console.error('Error fetching data from Supabase:', error);
    } finally {
      setLoading(false);
    }
  }, [session, activeDogId]);

  useEffect(() => {
    if (session) {
      fetchInitialData();
    } else {
      setDogs([]);
      setWeightLogs([]);
      setFoodLogs([]);
      setDiaries([]);
      setLoading(false);
    }
  }, [session, fetchInitialData]);

  const activeDog = dogs.find(d => d.id === activeDogId);

  const filteredWeightLogs = weightLogs
    .filter(log => log.dogId === activeDogId);

  const filteredFoodLogs = foodLogs
    .filter(log => log.dogId === activeDogId);

  const filteredDiaries = diaries
    .filter(log => log.dogId === activeDogId);

  const addDog = useCallback(async (newDogData: Omit<Dog, 'id'>) => {
    try {
      if (!session?.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('dogs')
        .insert([{
          name: newDogData.name,
          breed: newDogData.breed,
          birthday: newDogData.birthday,
          image_url: newDogData.image,
          owner_id: session.user.id
        }])
        .select()
        .single();

      if (error) throw error;
      const mappedNewDog: Dog = {
        id: data.id,
        name: data.name,
        breed: data.breed || '',
        image: data.image_url || '',
        birthday: data.birthday || '',
        ownerId: data.owner_id
      };
      setDogs(prev => [...prev, mappedNewDog]);
      setActiveDogId(data.id);
    } catch (error) {
      console.error('Error adding dog:', error);
    }
  }, [session]);

  const updateDog = useCallback(async (id: string, updatedData: Partial<Dog>) => {
    try {
      const { data, error } = await supabase
        .from('dogs')
        .update({
          name: updatedData.name,
          breed: updatedData.breed,
          birthday: updatedData.birthday,
          image_url: updatedData.image
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      const mappedUpdatedDog: Dog = {
        id: data.id,
        name: data.name,
        breed: data.breed || '',
        image: data.image_url || '',
        birthday: data.birthday || '',
        ownerId: data.owner_id
      };
      setDogs(prev => prev.map(d => d.id === id ? mappedUpdatedDog : d));
    } catch (error) {
      console.error('Error updating dog:', error);
    }
  }, []);

  const deleteDog = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('dogs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setDogs(prev => prev.filter(d => d.id !== id));
      if (activeDogId === id) {
        setActiveDogId(prev => dogs.find(d => d.id !== id)?.id || null);
      }
    } catch (error) {
      console.error('Error deleting dog:', error);
    }
  }, [activeDogId, dogs]);

  const addWeightLog = useCallback(async (data: Omit<WeightLog, 'id'>) => {
    try {
      const { data: newLog, error } = await supabase
        .from('weight_logs')
        .insert([{
          dog_id: data.dogId,
          date: data.date,
          weight: data.weight
        }])
        .select()
        .single();

      if (error) throw error;
      setWeightLogs(prev => [...prev, {
        id: newLog.id,
        dogId: newLog.dog_id,
        date: newLog.date,
        weight: Number(newLog.weight)
      }]);
    } catch (error) {
      console.error('Error adding weight log:', error);
    }
  }, []);

  const addFoodLog = useCallback(async (data: Omit<FoodLog, 'id'>) => {
    try {
      const { data: newLog, error } = await supabase
        .from('food_logs')
        .insert([{
          dog_id: data.dogId,
          date: data.date,
          amount: data.amount,
          memo: data.memo
        }])
        .select()
        .single();

      if (error) throw error;
      setFoodLogs(prev => [...prev, {
        id: newLog.id,
        dogId: newLog.dog_id,
        date: newLog.date,
        amount: Number(newLog.amount),
        memo: newLog.memo || ''
      }]);
    } catch (error) {
      console.error('Error adding food log:', error);
    }
  }, []);

  const addDiary = useCallback(async (data: Omit<Diary, 'id'>) => {
    try {
      const { data: newLog, error } = await supabase
        .from('diaries')
        .insert([{
          dog_id: data.dogId,
          date: data.date,
          title: data.title,
          content: data.content
        }])
        .select()
        .single();

      if (error) throw error;
      setDiaries(prev => [{
        id: newLog.id,
        dogId: newLog.dog_id,
        date: newLog.date,
        title: newLog.title,
        content: newLog.content || ''
      }, ...prev]);
    } catch (error) {
      console.error('Error adding diary:', error);
    }
  }, []);

  return {
    dogs,
    activeDogId,
    setActiveDogId,
    activeDog,
    weightLogs: filteredWeightLogs,
    foodLogs: filteredFoodLogs,
    diaries: filteredDiaries,
    addDog,
    updateDog,
    deleteDog,
    addWeightLog,
    addFoodLog,
    addDiary,
    allLogs: { weightLogs, foodLogs },
    loading,
    user: session?.user || null,
    signOut: () => supabase.auth.signOut()
  };
};
