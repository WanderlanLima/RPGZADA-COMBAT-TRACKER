import React, { createContext, useState, useEffect } from 'react';
import supabase from '../supabase';

const CombatContext = createContext();

const CombatProvider = ({ children }) => {
    const [combatants, setCombatants] = useState([]);
    const [combatId, setCombatId] = useState(null);

    const addCombatant = async (newCombatant) => {
        setCombatants([...combatants, newCombatant]);

        if(combatId) {
            updateCombatInSupabase();
        }
    };

    const updateCombatant = async (updatedCombatant) => {
        const updatedList = combatants.map(combatant =>
        combatant.id === updatedCombatant.id ? updatedCombatant : combatant
    );
        setCombatants(updatedList);
        if(combatId) {
            updateCombatInSupabase();
        }
    };

    const removeCombatant = async (id) => {
        const updatedList = combatants.filter(combatant => combatant.id !== id);
        setCombatants(updatedList);
        if(combatId) {
            updateCombatInSupabase();
        }
    };

    const startNewCombat = async () => {
    const newCombat = {
        combatants: [],
    };

    const { data, error } = await supabase
        .from('combats')
        .insert([newCombat])
        .select();

    if (error) {
        console.error("Error creating new combat:", error)
        return
    }
        
    const id = data[0].id;
        setCombatId(id);
        setCombatants([]);
        window.history.pushState({}, '', `/?combatId=${id}`);
    };

    const updateCombatInSupabase = async () => {
        if (!combatId) return;
        const { error } = await supabase
            .from('combats')
            .update({ combatants })
            .eq('id', combatId);

        if (error) {
            console.error("Error updating combat:", error);
        }
    };

    const loadCombatFromSupabase = async (id) => {
        try {
            const { data, error } = await supabase
                .from('combats')
                .select('combatants')
                .eq('id', id)
                .single();

            if (error) {
                console.error("Error loading combat:", error);
                return
            }

            if(data) {
                setCombatants(data.combatants || []);
                setCombatId(id);
            } else {
                console.log("No such document!");
                setCombatants([]);
                setCombatId(null)
            }
        } catch (error) {
            console.error("Error loading combat:", error);
        }
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const combatIdFromUrl = urlParams.get('combatId');
        if (combatIdFromUrl) {
            loadCombatFromSupabase(combatIdFromUrl);
        }
    }, []);

    useEffect(() => {
    if(combatId) {
        updateCombatInSupabase()
    }
    }, [combatants, combatId]);

    return (
        <CombatContext.Provider value={{ combatants, addCombatant, updateCombatant, removeCombatant, startNewCombat, combatId }}>
            {children}
        </CombatContext.Provider>
    );
};

export { CombatContext, CombatProvider };