namespace PsExcercise {

    public delegate void Delegate();

    public delegate T1 Delegate<T1>();

    public delegate T1 Delegate<T1, T2>(T2 arg1);

    public delegate T1 Delegate<T1, T2, T3>(T2 arg1, T3 arg2);
}

